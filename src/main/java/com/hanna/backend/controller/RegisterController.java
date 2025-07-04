package com.hanna.backend.controller;

import com.hanna.backend.model.Register;
import com.hanna.backend.repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
@CrossOrigin(origins = "*")
public class RegisterController {
    @Autowired
    private RegisterRepository registerRepository;

    @PostMapping
    public Register createRegister(@RequestBody Register register) {
        return registerRepository.save(register);
    }
}
