# HR API Readiness

Inventory only — no invented contracts. Align with existing .NET APIs before wiring.

## Existing frontend API layer

| Service | Endpoint | Status |
|---|---|---|
| `authService.loginUser` | `POST /api/UserAuth/login` | Integrated |
| `authService.registerUser` | `POST /api/UserAuth/register` | Integrated (Admin/HR) |
| `profileService.getMyProfile` | `GET /api/Profile/ShowProfile` | Integrated (Member) |
| `profileService.updateMyProfile` | `PUT /api/Profile/UpdateProfile` | Integrated |
| `profileService.updateMyPassword` | `PUT /api/Profile/UpdatePassword` | Integrated |
| `apiRequest` | Bearer token + JSON/FormData | Shared client |

Proxy: Vite `/api` → `https://localhost:7295`

Auth roles from JWT claim map: Admin→admin, Manager→team-leader, HR→hr, Employee→member.

## HR pages — current data source

| Page | UI data today | Backend needed (confirm with .NET team) |
|---|---|---|
| Dashboard | Local mock | Aggregated HR stats / pending leaves |
| Employees | `AppDataContext` mock | Employee list/create/update/delete APIs |
| Attendance | Local mock (not shared `attendanceData`) | Attendance by date/department |
| Overtime | Local mock | OT requests list + approve/reject |
| Payroll | Local mock | Payroll periods + payslip generation |
| Leaves | Local mock | Leave requests + approve/reject |
| Fines & Rewards | Local mock | Fine/reward CRUD |
| Reports | Local mock | Report aggregates / export |
| Notifications | Local / shared mock | Notifications feed + mark read |

## Integration checklist (when contracts exist)

1. Add domain services under `src/services/` (e.g. `employeeService.js`) using `apiRequest` only.
2. Keep mocks behind a clear fallback or remove after endpoint confirmation.
3. Wire loading / error / empty states on each HR page.
4. Reuse `AuthContext` token via `apiRequest` — do not duplicate auth headers.
5. Do not change request/response shapes without backend evidence.
