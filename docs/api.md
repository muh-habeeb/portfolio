# API Documentation

## Endpoints

### Contact Form
- `POST /api/contact` - Submit a new contact message

### Admin Message Reply
- `POST /api/messages/reply` - Send a reply email to a contact message
  - Body: `{ messageId, replyMessage, adminName }`
  - Requires SMTP configuration

### Bulk Message Operations
- All bulk actions (read/unread/replied/delete) use Convex mutations
- Robust error handling for invalid IDs

## Convex Functions
- `getContactMessages` - Fetch all messages
- `updateContactStatus` - Update single message status
- `bulkUpdateMessageStatus` - Bulk status update
- `deleteContactMessage` - Delete single message
- `bulkDeleteMessages` - Bulk delete
- `addMessageReply` - Track replies and update status

## Email Service
- Uses Nodemailer for sending replies
- SMTP credentials required in `.env.local`

## Authentication
- All admin API routes require authentication

## Error Handling
- All endpoints return JSON with `success` or `error` fields
- Convex mutations log errors and skip invalid IDs

## Example Request
```bash
curl -X POST http://localhost:3000/api/messages/reply \
  -H "Content-Type: application/json" \
  -d '{"messageId": "abc123", "replyMessage": "Thank you!", "adminName": "Admin"}'
```
