package com.mwu.backend.service;

import jakarta.transaction.Transactional;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    public String uploadFile(MultipartFile file) ;

    String uploadImage(MultipartFile file);

}
