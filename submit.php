<?php
header('Content-Type: application/json');

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['nome', 'email', 'whatsapp', 'idade', 'experiencia', 'inicio'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
}

// Prepare email content
$to = 'lucianopaiva2.lpb@gmail.com';
$subject = 'Nova Inscrição - Personal Trainer';

$message = "Nova inscrição recebida:\n\n";
$message .= "Nome: " . $data['nome'] . "\n";
$message .= "Idade: " . $data['idade'] . "\n";
$message .= "Email: " . $data['email'] . "\n";
$message .= "WhatsApp: " . $data['whatsapp'] . "\n";
$message .= "Instagram: " . ($data['instagram'] ?? 'Não informado') . "\n";
$message .= "Experiência: " . $data['experiencia'] . "\n";
$message .= "Previsão de início: " . $data['inicio'] . "\n";

$headers = [
    'From' => 'noreply@seudominio.com',
    'Reply-To' => $data['email'],
    'X-Mailer' => 'PHP/' . phpversion()
];

// Send email
if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Formulário enviado com sucesso!']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao enviar o formulário']);
}