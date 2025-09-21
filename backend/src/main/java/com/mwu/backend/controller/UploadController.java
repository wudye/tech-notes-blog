package com.mwu.backend.controller;

import com.mwu.backend.model.enums.vo.upload.ImageVO;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class UploadController {

    @Autowired
    private UploadService uploadService;


    @PostMapping("/upload/image")
    public ApiResponse<ImageVO> uploadImage(@RequestParam("file") MultipartFile file) {
        return uploadService.uploadImage(file);
    }

}
