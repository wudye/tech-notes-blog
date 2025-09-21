package com.mwu.backend.service;

import com.mwu.backend.model.enums.vo.upload.ImageVO;
import com.mwu.backend.model.responses.ApiResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UploadService {
    ApiResponse<ImageVO> uploadImage(MultipartFile file);
}
