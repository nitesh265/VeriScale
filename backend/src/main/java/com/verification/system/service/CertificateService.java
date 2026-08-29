package com.verification.system.service;

import com.verification.system.model.Application;
import com.verification.system.model.Certificate;
import com.verification.system.model.Instrument;

import com.verification.system.repository.ApplicationRepository;
import com.verification.system.repository.CertificateRepository;
import com.verification.system.repository.InstrumentRepository;

import com.verification.system.util.CertificateNumberGenerator;
import com.verification.system.util.QrCodeGenerator;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

import java.time.LocalDate;

import java.util.List;

import java.awt.Color;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;

import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;

    private final ApplicationRepository applicationRepository;

    private final InstrumentRepository instrumentRepository;

    private final CertificateNumberGenerator numberGenerator;

    private final QrCodeGenerator qrCodeGenerator;

    public Certificate createForApplication(
            String applicationId
    ) throws Exception {

        Application application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(
                                () ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        if (
                !application
                        .getStatus()
                        .equals(
                                Application.Status
                                        .APPROVED
                                        .name()
                        )
        ) {

            throw new RuntimeException(
                    "Application must be approved first"
            );
        }

        if (
                certificateRepository
                        .findByApplicationId(
                                applicationId
                        )
                        .isPresent()
        ) {

            throw new RuntimeException(
                    "Certificate already exists"
            );
        }

        Instrument instrument =
                instrumentRepository
                        .findById(
                                application.getInstrumentId()
                        )
                        .orElseThrow(
                                () ->
                                new RuntimeException(
                                        "Instrument not found"
                                )
                        );

        String certificateNumber =
                numberGenerator.generate();

        Certificate certificate =
                new Certificate();

        certificate.setCertificateNumber(
                certificateNumber
        );

        certificate.setApplicationId(
                applicationId
        );

        certificate.setApplicantId(
                application.getApplicantId()
        );

        certificate.setInstrumentId(
                instrument.getId()
        );

        certificate.setInstrumentName(
                instrument.getInstrumentName()
        );

        certificate.setSerialNumber(
                instrument.getSerialNumber()
        );

        certificate.setIssueDate(
                LocalDate.now()
        );

        certificate.setValidUntil(
                LocalDate.now()
                        .plusYears(1)
                        .minusDays(1)
        );

        certificate.setStatus(
                Certificate.Status.ACTIVE.name()
        );

        String verificationUrl =
                "http://localhost:5173/verify-certificate/"
                        + certificateNumber;

        byte[] qr =
                qrCodeGenerator.generate(
                        verificationUrl
                );

        certificate.setQrCode(
                java.util.Base64
                        .getEncoder()
                        .encodeToString(qr)
        );

        Certificate saved =
                certificateRepository.save(
                        certificate
                );

        instrument.setStatus("VERIFIED");
        instrumentRepository.save(instrument);

        application.setStatus(
                Application.Status
                        .CERTIFICATE_ISSUED
                        .name()
        );

        applicationRepository.save(
                application
        );

        return saved;
    }

        public Certificate createForInstrument(String instrumentId) throws Exception {
                Instrument instrument = instrumentRepository.findById(instrumentId)
                                .orElseThrow(() -> new RuntimeException("Instrument not found"));

                if (certificateRepository.findByApplicationId(instrumentId).isPresent()
                                || certificateRepository.existsByInstrumentId(instrumentId)) {
                        throw new RuntimeException("Certificate already exists for this instrument");
                }

                Certificate certificate = new Certificate();
                certificate.setCertificateNumber(numberGenerator.generate());
                certificate.setApplicantId(instrument.getApplicantId());
                certificate.setInstrumentId(instrument.getId());
                certificate.setInstrumentName(instrument.getInstrumentName());
                certificate.setSerialNumber(instrument.getSerialNumber());
                certificate.setIssueDate(LocalDate.now());
                certificate.setValidUntil(LocalDate.now().plusYears(1).minusDays(1));
                certificate.setStatus(Certificate.Status.ACTIVE.name());

                String verificationUrl = "http://localhost:5173/verify-certificate/" + certificate.getCertificateNumber();
                certificate.setQrCode(java.util.Base64.getEncoder().encodeToString(qrCodeGenerator.generate(verificationUrl)));

                Certificate saved = certificateRepository.save(certificate);
                instrument.setStatus("VERIFIED");
                instrumentRepository.save(instrument);
                return saved;
        }

    public List<Certificate> getAll() {

        return certificateRepository
                .findAll();
    }

    public List<Certificate> getMine(
            String applicantId
    ) {

        return certificateRepository
                .findByApplicantId(
                        applicantId
                );
    }

    public Certificate getById(
            String id
    ) {

        return certificateRepository
                .findById(id)
                .orElseThrow(
                        () ->
                        new RuntimeException(
                                "Certificate not found"
                        )
                );
    }

    public Certificate verify(
            String certificateNumber
    ) {

        Certificate certificate =
                certificateRepository
                        .findByCertificateNumber(
                                certificateNumber
                        )
                        .orElseThrow(
                                () ->
                                new RuntimeException(
                                        "Certificate not found"
                                )
                        );

        if (
                certificate
                        .getValidUntil()
                        .isBefore(
                                LocalDate.now()
                        )
        ) {

            certificate.setStatus(
                    Certificate.Status.EXPIRED
                            .name()
            );

            certificateRepository.save(
                    certificate
            );
        }

        return certificate;
    }

    public byte[] generatePdf(String id) throws Exception {
        Certificate certificate = getById(id);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 42, 42, 36, 36);
        PdfWriter.getInstance(document, output);
        document.open();

        Color navy = new Color(18, 55, 91);
        Color gold = new Color(190, 133, 35);
        Color paleBlue = new Color(245, 249, 253);
        Color line = new Color(167, 181, 195);

        PdfPTable frame = new PdfPTable(1);
        frame.setWidthPercentage(100);
        PdfPCell frameCell = new PdfPCell();
        frameCell.setBorderColor(navy);
        frameCell.setBorderWidth(2.5f);
        frameCell.setPadding(22);

        Paragraph organization = new Paragraph("ONLINE VERIFICATION SYSTEM", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, navy));
        organization.setAlignment(Element.ALIGN_CENTER);
        frameCell.addElement(organization);

        Paragraph emblem = new Paragraph("[  OVS  ]", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, gold));
        emblem.setAlignment(Element.ALIGN_CENTER);
        emblem.setSpacingBefore(8);
        frameCell.addElement(emblem);

        Paragraph title = new Paragraph("INSTRUMENT VERIFICATION\nCERTIFICATE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 25, navy));
        title.setAlignment(Element.ALIGN_CENTER);
        title.setLeading(28);
        title.setSpacingBefore(8);
        frameCell.addElement(title);

        Paragraph rule = new Paragraph("------------------------------", FontFactory.getFont(FontFactory.HELVETICA, 12, gold));
        rule.setAlignment(Element.ALIGN_CENTER);
        frameCell.addElement(rule);

        Paragraph statement = new Paragraph(
                "This is to certify that the instrument mentioned below has been verified and found to be in accordance with applicable standards and regulations.",
                FontFactory.getFont(FontFactory.HELVETICA, 10, navy)
        );
        statement.setAlignment(Element.ALIGN_CENTER);
        statement.setLeading(14);
        statement.setSpacingBefore(4);
        statement.setSpacingAfter(18);
        frameCell.addElement(statement);

        PdfPTable details = new PdfPTable(new float[]{1.05f, 0.08f, 2.2f});
        details.setWidthPercentage(100);
        addCertificateRow(details, "Certificate Number", certificate.getCertificateNumber(), paleBlue, line, navy);
        addCertificateRow(details, "Applicant ID", certificate.getApplicantId(), Color.WHITE, line, navy);
        addCertificateRow(details, "Instrument ID", certificate.getInstrumentId(), paleBlue, line, navy);
        addCertificateRow(details, "Instrument", certificate.getInstrumentName(), Color.WHITE, line, navy);
        addCertificateRow(details, "Serial Number", certificate.getSerialNumber(), paleBlue, line, navy);
        addCertificateRow(details, "Issue Date", String.valueOf(certificate.getIssueDate()), Color.WHITE, line, navy);
        addCertificateRow(details, "Valid Until", String.valueOf(certificate.getValidUntil()), paleBlue, line, navy);
        addCertificateRow(details, "Status", certificate.getStatus(), Color.WHITE, line, new Color(22, 125, 67));
        frameCell.addElement(details);

        Paragraph approval = new Paragraph("APPROVED", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(22, 125, 67)));
        approval.setAlignment(Element.ALIGN_CENTER);
        approval.setSpacingBefore(18);
        frameCell.addElement(approval);

        Paragraph footer = new Paragraph(
                "This certificate is computer generated and does not require a physical signature.",
                FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, Color.GRAY)
        );
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(25);
        frameCell.addElement(footer);

        frame.addCell(frameCell);
        document.add(frame);
        document.close();
        return output.toByteArray();
    }

    private void addCertificateRow(PdfPTable table, String label, String value, Color background, Color border, Color valueColor) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, FontFactory.getFont(FontFactory.HELVETICA, 9, Color.DARK_GRAY)));
        PdfPCell separatorCell = new PdfPCell(new Phrase(":", FontFactory.getFont(FontFactory.HELVETICA, 9, Color.DARK_GRAY)));
        PdfPCell valueCell = new PdfPCell(new Phrase(value == null ? "-" : value, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, valueColor)));

        for (PdfPCell cell : new PdfPCell[]{labelCell, separatorCell, valueCell}) {
            cell.setBackgroundColor(background);
            cell.setBorderColor(border);
            cell.setPadding(8);
        }

        separatorCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(labelCell);
        table.addCell(separatorCell);
        table.addCell(valueCell);
    }

}