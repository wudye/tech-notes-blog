package com.mwu.backend.model.responses;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class ApiResponse <T>{

    /**
     * 响应码
     */
    private int code;

    /**
     * 响应消息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    /**
     * 构造函数
     *
     * @param code 响应码
     * @param message 响应消息
     * @param data 响应数据
     */
    public ApiResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
    /**
     * 创建成功响应（无数据）
     *
     * @return API响应
     */
//    public static ApiResponse<EmptyVO> success() {
//        return new ApiResponse<>(200, "Success", new EmptyVO());
//    }

    public static <T>ApiResponse<T> success(String message) {


        return new ApiResponse<>(200, message, null);

    }
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data);
    }
    /**
     * 创建错误响应
     *
     * @param code 错误码
     * @param message 错误消息
     * @return API响应
     */
    public static <T> ApiResponse<T> error(int code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }

    /**
     * 创建带数据的错误响应
     *
     * @param code 错误码
     * @param message 错误消息
     * @param data 错误数据
     * @return API响应
     */
    public static <T> ApiResponse<T> error(int code, String message, T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(code);
        response.setMessage(message);
        response.setData(data);
        return response;
    }
}
