export const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dompell</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

     font-family: 'Outfit', sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #F5F7FA;
      color: #2B2B2B;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .header {
      background: #E6F1FB;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #1877F2;
      font-size: 20px;
      font-weight: 700;
    }
    .content {
      padding: 30px;
      background-color: #ffffff;
    }
    .content h2 {
      font-size: 18px;
      margin-bottom: 15px;
      font-weight: 700;
      color: #000;
    }
    .content p {
      font-size: 15px;
      margin: 10px 0;
      color: #333;
    }
    .buttons {
      margin: 25px 0;
      text-align: left;
    }
    .btn {
      display: inline-block;
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      margin-right: 10px;
    }
    .btn-primary {
      background: #007BFF;
      color: #fff !important;
    }
    .btn-secondary {
      background: #E6F1FB;
      color: #007BFF !important;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #666;
      background: #F9FAFB;
      border-top: 1px solid #EAEAEA;
    }
    .footer a {
      color: #1877F2;
      text-decoration: none;
      margin: 0 6px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="header">Dompell</h1>
     <div class="content">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Dompell. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
      <p>
        <a href="#privacy">Privacy Policy</a> | 
        <a href="#terms">Terms of Service</a> | 
        <a href="#contact">Contact Us</a>
      </p>
    </div>
  </div>
</body>
</html>
`;
