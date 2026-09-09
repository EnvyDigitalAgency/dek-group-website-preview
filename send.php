<?php
/**
 * DEK Advisory Group — contact form handler.
 *
 * Runs on the site's own server, so enquiry details never pass through a
 * third party. Sends to dion@dekgroup.com.au.
 *
 * If PHP mail() is disabled on the host, swap the form action in contact.html
 * to a hosted service instead. See "How to publish.md".
 */

declare(strict_types=1);

const MAIL_TO      = 'dion@dekgroup.com.au';
const MAIL_FROM    = 'website@dekgroup.com.au';   // must be on this domain for SPF
const SITE_NAME    = 'DEK Advisory Group';
const THANKS_PAGE  = '/thanks.html';
const FORM_PAGE    = '/contact.html';

// Only accept POST.
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: ' . FORM_PAGE, true, 303);
    exit;
}

/** Trim and cap a posted field. */
function field(string $key, int $max = 2000): string
{
    $v = $_POST[$key] ?? '';
    if (!is_string($v)) {
        return '';
    }
    return mb_substr(trim($v), 0, $max);
}

/** Strip CR/LF so a value can never inject extra mail headers. */
function headerSafe(string $v): string
{
    return str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v);
}

// Honeypot: hidden field only a bot fills in. Pretend success and drop it.
if (field('_company') !== '') {
    header('Location: ' . THANKS_PAGE, true, 303);
    exit;
}

$name    = field('name', 200);
$email   = field('email', 320);
$phone   = field('phone', 60);
$topic   = field('topic', 120);
$message = field('message', 5000);

// Validate. On failure send them back with a flag the page can read.
$emailOk = $email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
if ($name === '' || !$emailOk) {
    header('Location: ' . FORM_PAGE . '?error=1', true, 303);
    exit;
}

$subject = 'Website enquiry from ' . headerSafe($name);

$body = "New enquiry from the " . SITE_NAME . " website.\n\n"
      . "Name:     " . $name . "\n"
      . "Email:    " . $email . "\n"
      . "Phone:    " . ($phone !== '' ? $phone : '(not supplied)') . "\n"
      . "About:    " . ($topic !== '' ? $topic : '(not selected)') . "\n\n"
      . "Message:\n"
      . ($message !== '' ? $message : '(no message)') . "\n\n"
      . "-- \n"
      . "Sent " . date('j M Y, g:ia') . "\n"
      . "IP " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

$headers = [
    'From'         => SITE_NAME . ' <' . MAIL_FROM . '>',
    'Reply-To'     => headerSafe($name) . ' <' . headerSafe($email) . '>',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer'     => 'PHP/' . phpversion(),
];

$headerLines = [];
foreach ($headers as $k => $v) {
    $headerLines[] = $k . ': ' . $v;
}

$sent = @mail(
    MAIL_TO,
    $subject,
    $body,
    implode("\r\n", $headerLines),
    '-f' . MAIL_FROM
);

header('Location: ' . ($sent ? THANKS_PAGE : FORM_PAGE . '?error=2'), true, 303);
exit;
