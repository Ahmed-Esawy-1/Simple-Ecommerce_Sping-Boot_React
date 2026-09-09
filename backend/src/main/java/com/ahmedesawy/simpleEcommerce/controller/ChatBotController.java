package com.ahmedesawy.simpleEcommerce.controller;



import com.ahmedesawy.simpleEcommerce.service.ChatBotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
@RequiredArgsConstructor
public class ChatBotController {

    private final ChatBotService chatBotService;

    @GetMapping("/ask")
    public ResponseEntity<String> askBot(@RequestParam String message) {
        String response = chatBotService.getBotResponse(message);
        return ResponseEntity.ok(response);
    }

}
