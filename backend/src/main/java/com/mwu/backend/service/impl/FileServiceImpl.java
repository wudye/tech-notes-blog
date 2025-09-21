package com.mwu.backend.service.impl;

import com.mwu.backend.service.FileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    /**
     * 基础上传路径（本地存储的绝对或相对路径）
     */
    @Value("${upload.path}")
    private String uploadBasePath;

    /**
     * 返回给前端的地址前缀 (可配合CDN/Nginx等)
     */
    @Value("${upload.url-prefix}")
    private String urlPrefix;

    /**
     * 允许上传的图片后缀名（小写形式）
     */
    private static final List<String> ALLOWED_IMAGE_EXTENSIONS
            = Arrays.asList(".jpg", ".jpeg", ".png", ".webp");

    /**
     * 单个图片最大尺寸 (10MB)
     */
    private static final long MAX_IMAGE_SIZE = 10 * 1024 * 1024;

    @Override
    public String uploadFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw  new IllegalArgumentException("file is empty");
        }
        return doUpload(file);
    }

    @Override
    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("上传的图片文件为空");
        }

        // 校验文件大小
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("图片大小不能超过 10MB");
        }
        String originalFilename = file.getOriginalFilename();


        // 校验后缀（小写判断）
        String lowerCaseExtension = originalFilename
                .substring(originalFilename.lastIndexOf("."))
                .toLowerCase();

        if (!ALLOWED_IMAGE_EXTENSIONS.contains(lowerCaseExtension)) {
            throw new IllegalArgumentException(
                    "只支持 " + ALLOWED_IMAGE_EXTENSIONS + " 等格式图片");
        }
        return doUpload(file);

    }

    private String doUpload(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new IllegalArgumentException("file name is invalid");
        }
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        if (!ALLOWED_IMAGE_EXTENSIONS.contains(fileExtension)) {
            throw new IllegalArgumentException("file type is not allowed");
        }
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("file size exceeds the limit of 10MB");
        }

        String newFileName = UUID.randomUUID() + fileExtension;
        File uploadDir = new File(uploadBasePath);
        if (!uploadDir.exists() && !uploadDir.isDirectory()) {
            throw new IllegalArgumentException("upload path is invalid");
        }
        if (!uploadDir.exists()) {
            boolean dirsCreated = uploadDir.mkdirs();
            if (!dirsCreated) {
                throw new RuntimeException("failed to create upload directory");
            }
        }

        File destFile = new File(uploadDir, newFileName);
        try {
            file.transferTo(destFile);
        } catch (Exception e) {
            throw new RuntimeException("failed to save file", e);
        }
        return urlPrefix + "/" + newFileName;
        // 构建存储路径




    }
}
