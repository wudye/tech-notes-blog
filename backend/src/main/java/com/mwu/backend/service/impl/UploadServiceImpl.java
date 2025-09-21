package com.mwu.backend.service.impl;

import com.mwu.backend.model.enums.vo.upload.ImageVO;
import com.mwu.backend.model.responses.ApiResponse;
import com.mwu.backend.service.FileService;
import com.mwu.backend.service.UploadService;
import com.mwu.backend.utils.ApiResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadServiceImpl implements UploadService {
    @Autowired
    private  FileService fileService;
    @Override
    public ApiResponse<ImageVO> uploadImage(MultipartFile file) {
        String url = fileService.uploadImage(file);
        ImageVO imageVO = new ImageVO();
        imageVO.setUrl(url);
        return ApiResponseUtil.success("上传成功", imageVO);
    }
}
