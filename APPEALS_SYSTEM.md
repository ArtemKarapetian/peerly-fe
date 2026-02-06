# Student Appeals System - Implementation Summary

## ✅ Completed Implementation

### **Routes**:
- `/courses/:courseId/tasks/:taskId/appeal` - Create appeal page
- `/appeals` - Appeals list page

---

## 🎯 Features

### 1. **Create Appeal Page** (`/src/app/student/CreateAppealPage.tsx`)

**Location**: Accessible from Task page when status is "GRADED"

**Breadcrumb Navigation**:
- Курсы → <Course Name> → <Task Name> → Апелляция

**Context Summary Card**:
- Current score (78/100)
- Number of reviews received (3)
- Appeal submission deadline

**Appeal Form**:
- **Reason Category** (dropdown):
  - Несправедливая оценка (Unfair score)
  - Неправильная интерпретация (Wrong interpretation)
  - Техническая проблема (Technical issue)
  - Другое (Other)
  
- **Message** (textarea):
  - Required field
  - Minimum 20 characters
  - Character counter (0/1000)
  - Large text area for detailed explanation
  
- **Optional Attachment**:
  - Demo file upload UI
  - Shows selected filename
  - Remove button
  - Accepts PDF, DOC, DOCX (up to 10MB - demo only)

**Validation**:
- Message required
- Minimum 20 characters enforced
- Error display with list of validation failures

**Success State**:
- Replaces form with success message
- Confirmation icon
- Buttons:
  - "Мои апелляции" → Navigate to appeals list
  - "Вернуться к курсу" → Back to course page

**Info Note**:
- Teacher response timeline (5 business days)
- Notification promise

---

### 2. **Appeals List Page** (`/src/app/student/AppealsListPage.tsx`)

**Layout**: Cards grouped by status

**Status Groups**:
1. **Новая (New)** - Just submitted
2. **На рассмотрении (In Review)** - Teacher is reviewing
3. **Рассмотрена (Resolved)** - Teacher has responded

**Appeal Card**:
- Course name → Task name
- Creation date
- Reason category
- Current score
- Status badge with color coding:
  - New: Blue
  - In Review: Yellow
  - Resolved: Green
- Hover effect with border highlight
- Click to open detail drawer

**Empty State**:
- Friendly message when no appeals exist
- Call-to-action to go to courses

---

### 3. **Appeal Detail Drawer**

**Trigger**: Click on any appeal card

**Design**: Right-side drawer overlay (600px max width)

**Information Displayed**:

**Header**:
- Title: "Детали апелляции"
- Close button (X)

**Status Badge**:
- Large status indicator with color coding

**Course & Task Info**:
- Course name
- Task name
- Displayed in muted card

**Score Information**:
- Current score (large display)
- Number of reviews received

**Appeal Details**:
- Reason category (with icon)
- Full message text (preserves whitespace/formatting)
- Attachment (if uploaded)

**Timeline**:
- Appeal created timestamp
- Status change timestamp (if applicable)
- Visual timeline with colored dots

**Teacher Response** (when available):
- Teacher's message
- Responded by (teacher name)
- Response date
- New score (if changed)
- Highlighted in accent color

**Pending State** (when no response):
- Clock icon
- Status message based on appeal state

---

## 💾 Data Structure (`/src/app/utils/appeals.ts`)

### **Appeal Interface**:
```typescript
interface Appeal {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  taskId: string;
  taskName: string;
  
  reason: AppealReason;
  message: string;
  attachmentName?: string;
  
  currentScore?: number;
  maxScore?: number;
  reviewCount?: number;
  
  status: AppealStatus;
  createdAt: string;
  updatedAt: string;
  
  teacherResponse?: {
    message: string;
    respondedBy: string;
    respondedAt: string;
    newScore?: number;
  };
}
```

### **Storage Functions**:
- `getAppeals()` - Get all appeals
- `getStudentAppeals(studentId)` - Filter by student
- `getAppealById(id)` - Get single appeal
- `createAppeal()` - Create new appeal
- `updateAppealStatus()` - Change status
- `addTeacherResponse()` - Add teacher's response
- `getReasonLabel()` - Get localized reason text
- `getStatusLabel()` - Get localized status text
- `getStatusColor()` - Get Tailwind color classes

### **localStorage Persistence**:
- Key: `peerly_appeals`
- Automatic save on create/update
- JSON serialization

---

## 🔗 Integration Points

### **TaskPage Status Card**:
- Added "Запросить пересмотр оценки" button
- Only visible when status is "GRADED"
- Uses AlertCircle icon
- Navigates to `/courses/{courseId}/tasks/{taskId}/appeal`

### **Router Configuration**:
Updated `/src/app/RouterExtended.tsx`:
- Route pattern: `/courses/:courseId/tasks/:taskId/appeal`
- Route: `/appeals` → AppealsListPage
- Imported CreateAppealPage and AppealsListPage

---

## 🎨 Design Consistency

### **Visual Style**:
- Follows Peerly design system
- Semantic tokens: `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`
- Rounded corners: `rounded-[20px]`, `rounded-[12px]`, `rounded-[8px]`
- Icon badges for section headers
- Consistent spacing with 8pt grid

### **Colors**:
- Accent: `bg-accent`, `text-accent-foreground`
- Success: Green tints (#e9f9e6, #9cf38d)
- Info: Blue tints (#e9f5ff, #b7bdff)
- Warning: Yellow tints (#fff8e1, #ffd4a3)
- Error: Red tints (#ffe9e9, #ffb8b8)

### **Status Badge Colors**:
- New: `bg-blue-100 text-blue-800 border-blue-200`
- In Review: `bg-yellow-100 text-yellow-800 border-yellow-200`
- Resolved: `bg-green-100 text-green-800 border-green-200`

### **Icons** (from lucide-react):
- AlertCircle - Main appeal icon
- FileText - Document/reason icon
- MessageSquare - Message icon
- Upload - Attachment icon
- CheckCircle - Success/completion
- Clock - Timeline/pending
- User - Teacher response
- Calendar - Dates
- Target - Score
- Users - Reviews count

---

## 📱 Responsive Design

### **Create Appeal Page**:
- Max-width container (800px)
- Context summary cards stack on mobile
- Form fields full-width
- Buttons stack on small screens

### **Appeals List**:
- Max-width container (1000px)
- Cards full-width with proper spacing
- Status sections stack naturally

### **Detail Drawer**:
- Full-width on mobile (<600px)
- Fixed 600px width on desktop
- Scrollable content
- Fixed header for navigation

---

## 🚀 User Flow

### **Creating an Appeal**:
1. Student views graded task
2. Sees score they disagree with
3. Clicks "Запросить пересмотр оценки" in Status Card
4. Navigates to create appeal page
5. Reviews context (score, reviews, deadline)
6. Selects reason category
7. Writes detailed explanation (min 20 chars)
8. Optionally uploads supporting document
9. Clicks "Отправить апелляцию"
10. Sees success confirmation
11. Can navigate to "Мои апелляции" or back to course

### **Viewing Appeals**:
1. Navigate to `/appeals` from student sidebar (if added) or direct URL
2. See all appeals grouped by status
3. Click any appeal card
4. Drawer opens with full details
5. See timeline and status
6. If resolved, see teacher response
7. Close drawer to return to list

---

## 🎯 Future Enhancements (Structured for Implementation)

### **Teacher Workflow** (Not yet implemented):
- Teacher appeals inbox page
- Respond to appeal UI
- Update score directly
- Mark as resolved

### **Notifications**:
- Email notification on appeal status change
- In-app notification bell integration
- Push notifications (if enabled)

### **Analytics**:
- Track appeal resolution time
- Monitor appeal success rate
- Identify patterns in appeals

### **Advanced Features**:
- Appeal conversation thread (multiple messages)
- Attach grading rubric to appeal
- Compare with other submissions
- Escalation to department head

---

## ✅ Acceptance Criteria Met

- [x] Route `/courses/:courseId/tasks/:taskId/appeal` exists
- [x] Route `/appeals` exists
- [x] Breadcrumb navigation working
- [x] Context summary showing score, reviews, deadline
- [x] Form with reason category dropdown
- [x] Form with required message field (min length validation)
- [x] Optional attachment upload (demo UI)
- [x] Submit button with success state
- [x] Link to appeals list after submission
- [x] Appeals list grouped by status (New/In Review/Resolved)
- [x] Appeal cards show course, task, date, status badge
- [x] Detail drawer opens on card click
- [x] Teacher response placeholder in drawer
- [x] All copy in Russian
- [x] Consistent with Peerly design system
- [x] Demo-only (no real backend)
- [x] Structured for future teacher response implementation

---

## 📝 Russian Copy Examples

- "Запрос на пересмотр оценки" - Appeal request
- "Апелляция отправлена" - Appeal submitted
- "Мои апелляции" - My appeals
- "Новая" - New
- "На рассмотрении" - In review
- "Рассмотрена" - Resolved
- "Несправедливая оценка" - Unfair score
- "Неправильная интерпретация" - Wrong interpretation
- "Техническая проблема" - Technical issue
- "Подробное описание" - Detailed description
- "Ответ преподавателя" - Teacher response
- "Ожидает рассмотрения преподавателем" - Awaiting teacher review

---

## 🎉 Implementation Complete!

The student appeal system is fully functional and ready for use. Students can now request grade reviews from task pages and track their appeals in a dedicated list view with detailed information drawers.
