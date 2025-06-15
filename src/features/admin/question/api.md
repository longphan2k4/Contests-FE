### Question Fields
- `id` (number): Unique identifier
- `intro` (string, optional): Introduction or context
- `defaultTime` (number): Time limit in seconds
- `questionType` (enum): `multiple_choice` or `essay`
- `content` (string): HTML content of the question
- `questionMedia` (array): Attached media files (images, videos, audio)
- `options` (array): Answer options (flexible format)
- `correctAnswer` (string): Correct answer
- `mediaAnswer` (array): Media files for answer explanation
- `score` (number): Points awarded for correct answer
- `difficulty` (enum): `Alpha`, `Beta`, `Rc`, `Gold`
- `explanation` (string): Explanation of the answer
- `isActive` (boolean): Whether question is active
- `questionTopicId` (number): Reference to question topic
- `createdAt`, `updatedAt` (datetime): Timestamps

### Options Format Support
The API supports flexible options format:

**Array of strings (recommended for frontend):**
```json
"options": ["Option A", "Option B", "Option C", "Option D"]
```

**Array of objects (with explicit IDs):**
```json
"options": [
  {"id": "A", "text": "Option A"},
  {"id": "B", "text": "Option B"},
  {"id": "C", "text": "Option C"},
  {"id": "D", "text": "Option D"}
]
```

For essay questions, `options` should be `null`.

## Endpoints

### 1. Get Questions (List with Filtering)
**GET** `/api/questions`

**Query Parameters:**
- `page` (number, default: 1): Page number for pagination
- `limit` (number, default: 10, max: 100): Items per page
- `search` (string): Search in content and explanation
- `questionTopicId` (number): Filter by question topic
- `questionType` (enum): Filter by question type (`multiple_choice`, `essay`)
- `difficulty` (enum): Filter by difficulty (`Alpha`, `Beta`, `Rc`, `Gold`)
- `hasMedia` (boolean): Filter questions with/without media
- `isActive` (boolean): Filter by active status
- `sortBy` (enum): Sort field (`createdAt`, `updatedAt`, `defaultTime`, `score`)
- `sortOrder` (enum): Sort order (`asc`, `desc`)

**Response:**
```json
{
  "success": true,
  "message": "Lấy danh sách câu hỏi thành công",
  "data": {
    "questions": [
      {
        "id": 1,
        "intro": "Câu hỏi toán học cơ bản",
        "defaultTime": 30,
        "questionType": "multiple_choice",
        "content": "<p>Tính: 2 + 3 = ?</p>",
        "questionMedia": [
          {
            "type": "image",
            "url": "/uploads/questions/question-image-123456789.jpg",
            "filename": "question-image-123456789.jpg",
            "size": 245760,
            "mimeType": "image/jpeg",
            "dimensions": {
              "width": 800,
              "height": 600
            }
          }        ],
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option B",
        "mediaAnswer": [
          {
            "type": "video",
            "url": "/uploads/questions/question-video-987654321.mp4",
            "filename": "question-video-987654321.mp4",
            "size": 5242880,
            "mimeType": "video/mp4",
            "duration": 120,
            "dimensions": {
              "width": 1920,
              "height": 1080
            }
          }
        ],
        "score": 10,
        "difficulty": "Alpha",
        "explanation": "2 + 3 = 5 là phép cộng cơ bản",
        "questionTopicId": 1,
        "isActive": true,
        "createdAt": "2025-06-14T03:00:00.000Z",
        "updatedAt": "2025-06-14T03:00:00.000Z",
        "questionTopic": {
          "id": 1,
          "name": "Toán học cơ bản"
        },
        "questionDetails": [
          {
            "questionPackageId": 1,
            "questionOrder": 1,
            "questionPackage": {
              "id": 1,
              "name": "Bộ câu hỏi toán lớp 1"
            }
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 2. Get Question by ID
**GET** `/api/questions/:id`

**Response:** Same as single question object in list response.

### 3. Create Question
**POST** `/api/questions`
**Authentication:** Required (Admin/Judge)
**Content-Type:** `multipart/form-data`

**Form Fields:**
- `intro` (string, optional): Question introduction
- `defaultTime` (number, required): Time limit in seconds (10-1800)
- `questionType` (enum, required): `multiple_choice` or `essay`
- `content` (string, required): HTML content of question
- `options` (JSON string, conditional): Required for multiple_choice questions
- `correctAnswer` (string, required): Correct answer
- `score` (number, optional, default: 1): Question score (1-100)
- `difficulty` (enum, required): `Alpha`, `Beta`, `Rc`, `Gold`
- `explanation` (string, optional): Answer explanation
- `questionTopicId` (number, required): Reference to question topic

**Media Fields:**
- `questionMedia` (files, optional): Up to 5 media files for question
- `mediaAnswer` (files, optional): Up to 5 media files for answer

**Example Options JSON (Multiple Formats Supported):**

**Simple Array Format (Recommended):**
```json
["Option A", "Option B", "Option C", "Option D"]
```

**Object Format (With IDs):**
```json
["jksdhjk", "đấk", "dadjhadhj", "dajkdjas",....]
```

**For Essay Questions:**
Set `options` to `null` or omit it entirely.

**Media File Limits:**
- **Images**: JPEG, PNG, GIF, WebP, SVG - Max 5MB each
- **Videos**: MP4, AVI, MOV, WMV, FLV, WebM, MKV - Max 100MB each
- **Audio**: MP3, WAV, OGG, AAC, FLAC, M4A - Max 20MB each

### 4. Update Question (PATCH)
**PATCH** `/api/questions/:id`
**Authentication:** Currently disabled for testing
**Content-Type:** `multipart/form-data`

All fields from create are optional. Only provided fields will be updated.

**Special Behavior:**
- Uploading new media files will replace existing ones of the same type
- Old media files are automatically deleted when replaced
- At least one field or media file must be provided

### 5. Soft Delete Question
**DELETE** `/api/questions/:id`
**Authentication:** Currently disabled for testing

Sets `isActive = false`. Question data and media files are preserved.

### 6. Hard Delete Question
**DELETE** `/api/questions/:id/hard`
**Authentication:** Currently disabled for testing

Permanently deletes question and all associated media files.

### 7. Batch Delete Questions
**DELETE** `/api/questions/batch`
**Authentication:** Currently disabled for testing

**Request Body:**
```json
{
  "ids": [1, 2, 3, 4, 5],
  "hardDelete": false
}
```

**Validation:**
- `ids`: Array of 1-100 positive integers
- `hardDelete`: Boolean, default false

**Response Scenarios:**

**All Success (200):**
```json
{
  "success": true,
  "message": "Xóa thành công 5 câu hỏi",
  "data": {
    "successIds": [1, 2, 3, 4, 5],
    "failedIds": [],
    "errors": []
  }
}
```

**Partial Success (207):**
```json
{
  "success": true,
  "message": "Xóa thành công 3/5 câu hỏi", 
  "data": {
    "successIds": [1, 3, 5],
    "failedIds": [2, 4],
    "errors": [
      {
        "id": 2,
        "error": "Câu hỏi với ID 2 không tồn tại"
      },
      {
        "id": 4,
        "error": "Question is being used in active contests"
      }
    ]
  }
}
```

**All Failed (400):**
```json
{
  "success": false,
  "message": "Không thể xóa bất kỳ câu hỏi nào",
  "error": {
    "result": {
      "successIds": [],
      "failedIds": [1, 2, 3],
      "errors": [...]
    }
  }
}
```
