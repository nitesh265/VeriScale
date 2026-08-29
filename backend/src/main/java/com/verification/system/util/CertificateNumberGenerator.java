package com.verification.system.util;

import org.springframework.stereotype.Component;

import java.time.Year;

import java.util.concurrent.atomic.AtomicInteger;

@Component
public class CertificateNumberGenerator {

    private final AtomicInteger counter =
            new AtomicInteger(1);

    public String generate() {

        return String.format(
                "VC-%d-%05d",
                Year.now().getValue(),
                counter.getAndIncrement()
        );
    }
}