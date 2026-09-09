package com.ahmedesawy.simpleEcommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.pgvector.PgVectorStore;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatBotService {

    private final ResourceLoader resourceLoader;
    private final PgVectorStore vectorStore;
    private final ChatClient chatClient;

    public String getBotResponse(String userQuery) {
        try {
            String promptStringTemplate = Files.readString(
                    resourceLoader.getResource("classpath:prompts/chatbot-rag-prompt.st")
                            .getFile()
                            .toPath()
            );

            String context = fetchSemanticContext(userQuery);

            Map<String, Object> variables = new HashMap<>();
            variables.put("userQuery", userQuery);
            variables.put("context", context);

            PromptTemplate promptTemplate =  PromptTemplate.builder()
                    .template(promptStringTemplate)
                    .variables(variables)
                    .build();

            return chatClient.prompt(promptTemplate.create()).call().content();


        } catch (IOException e) {
            return "Bot Failed => " + e.getMessage();
        }

    }

    private String fetchSemanticContext(String userQuery) {

        List<Document> documents = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(userQuery)
                        .topK(5)
                        .similarityThreshold(.5)
                        .build()
        );

        StringBuilder context = new StringBuilder();
        for (Document document: documents) {
            context.append(document.getFormattedContent()).append("\n");
        }

        return context.toString();
    }

}
