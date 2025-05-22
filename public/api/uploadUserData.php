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

// 获取 data 和 name 参数
$data = isset($dataArray['data']) ? $dataArray['data'] : null;

// 获取 URL 中的 query 参数 name passwd
$name = isset($_GET['name']) ? $_GET['name'] : null;
$passwd = isset($_GET['passwd']) ? $_GET['passwd'] : null;

// 检查 name 是否提供
if (empty($name)) {
    echo json_encode([
        'code' => -1,
        'message' => 'name 参数是必需的'
    ]);
    exit;
}

// 定义保存路径
$savePath = "../../userData/" . basename($name) . "-" . basename($passwd) . "/data.json";

// 检查 data 和 name 是否提供
if (empty($data)) {
    echo json_encode([
        'code' => -1,
        'message' => 'data 参数是必需的'
    ]);
    exit;
}

// 确保目录存在，如果不存在则创建
$directory = dirname($savePath);
if (!is_dir($directory)) {
    mkdir($directory, 0777, true);
}

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
