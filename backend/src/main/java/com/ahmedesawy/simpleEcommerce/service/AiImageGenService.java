package com.ahmedesawy.simpleEcommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.google.genai.image.GoogleGenAiImageOptions;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;

@Service
@RequiredArgsConstructor
public class AiImageGenService {

    private final ImageModel imageModel;

    public byte[] generateImage(String prompt) {
        GoogleGenAiImageOptions options = GoogleGenAiImageOptions.builder()
                .n(1)
                .model("gemini-2.5-flash-image")
                .build();

        ImageResponse response = imageModel.call(new ImagePrompt(prompt, options));

        String imageUrl = response
                .getResult()
                .getOutput()
                .getUrl();


        try {
            return new URL(imageUrl).openStream().readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }
}
