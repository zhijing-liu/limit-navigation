<?php
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

// 检查文件是否存在
if (!file_exists($savePath)) {
    echo json_encode([
        'code' => -1,
        'message' => '文件不存在'
    ]);
    exit;
}

// 尝试读取文件内容
$content = file_get_contents($savePath);

// 检查读取是否成功
if ($content === false) {
    echo json_encode([
        'code' => -1,
        'message' => '读取文件失败'
    ]);
} else {
    // 返回成功的响应，包括读取的内容
    echo json_encode([
        'code' => 0,
        'message' => '文件读取成功',
        'data' => $content
    ]);
}
?>
