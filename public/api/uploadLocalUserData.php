<?php
// 获取请求的 body 数据
$jsonData = file_get_contents("php://input");

// 尝试解析 JSON 数据
$dataArray = json_decode($jsonData, true);

// 检查 JSON 数据是否正确解析
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'code' => -1,
        'message' => '无效的 JSON 数据'
    ]);
    exit;
}

// 获取 data 参数
$data = isset($dataArray['data']) ? $dataArray['data'] : null;

$passwd = isset($_GET['passwd']) ? $_GET['passwd'] : null;
$correctPasswd = '0825'; // 设置你的密码
// 检查 data 是否提供
if (empty($data)) {
    echo json_encode([
        'code' => -1,
        'message' => 'data 参数是必需的'
    ]);
    exit;
}
if ($passwd !== $correctPasswd) {
    echo json_encode([
        'code' => -1,
        'message' => '密码错误，拒绝保存'
    ]);
    exit;
}
// 定义保存路径
$savePath = "../systemConfig.json";

$directory = dirname($savePath);

// 尝试写入文件
if (file_put_contents($savePath, $data) !== false) {
    echo json_encode([
        'code' => 0,
        'message' => '文件保存成功'
    ]);
} else {
    echo json_encode([
        'code' => -1,
        'message' => '文件保存失败'
    ]);
}
?>
