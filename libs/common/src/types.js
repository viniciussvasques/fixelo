"use strict";
// Base types for Fixelo marketplace system
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.Language = exports.ServiceCategory = exports.PlanType = exports.PaymentStatus = exports.BookingStatus = exports.ServiceStatus = exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CLIENT"] = "CLIENT";
    UserRole["PROVIDER"] = "PROVIDER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
    UserStatus["PENDING_VERIFICATION"] = "PENDING_VERIFICATION";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus["ACTIVE"] = "ACTIVE";
    ServiceStatus["INACTIVE"] = "INACTIVE";
    ServiceStatus["DRAFT"] = "DRAFT";
    ServiceStatus["SUSPENDED"] = "SUSPENDED";
})(ServiceStatus || (exports.ServiceStatus = ServiceStatus = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["IN_PROGRESS"] = "IN_PROGRESS";
    BookingStatus["COMPLETED"] = "COMPLETED";
    BookingStatus["CANCELLED"] = "CANCELLED";
    BookingStatus["DISPUTED"] = "DISPUTED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PROCESSING"] = "PROCESSING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["DISPUTED"] = "DISPUTED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PlanType;
(function (PlanType) {
    PlanType["FREE"] = "FREE";
    PlanType["PRO"] = "PRO";
})(PlanType || (exports.PlanType = PlanType = {}));
var ServiceCategory;
(function (ServiceCategory) {
    ServiceCategory["CLEANING"] = "CLEANING";
    ServiceCategory["REPAIRS"] = "REPAIRS";
    ServiceCategory["BEAUTY"] = "BEAUTY";
    ServiceCategory["GARDENING"] = "GARDENING";
    ServiceCategory["PLUMBING"] = "PLUMBING";
    ServiceCategory["ELECTRICAL"] = "ELECTRICAL";
    ServiceCategory["PAINTING"] = "PAINTING";
    ServiceCategory["MOVING"] = "MOVING";
    ServiceCategory["TUTORING"] = "TUTORING";
    ServiceCategory["PHOTOGRAPHY"] = "PHOTOGRAPHY";
    ServiceCategory["EVENT_PLANNING"] = "EVENT_PLANNING";
    ServiceCategory["PET_CARE"] = "PET_CARE";
    ServiceCategory["OTHER"] = "OTHER";
})(ServiceCategory || (exports.ServiceCategory = ServiceCategory = {}));
var Language;
(function (Language) {
    Language["EN"] = "en";
    Language["PT"] = "pt";
    Language["ES"] = "es";
})(Language || (exports.Language = Language = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["BOOKING_REQUEST"] = "BOOKING_REQUEST";
    NotificationType["BOOKING_CONFIRMED"] = "BOOKING_CONFIRMED";
    NotificationType["BOOKING_CANCELLED"] = "BOOKING_CANCELLED";
    NotificationType["PAYMENT_RECEIVED"] = "PAYMENT_RECEIVED";
    NotificationType["MESSAGE_RECEIVED"] = "MESSAGE_RECEIVED";
    NotificationType["REVIEW_RECEIVED"] = "REVIEW_RECEIVED";
    NotificationType["PLAN_UPGRADED"] = "PLAN_UPGRADED";
    NotificationType["VERIFICATION_APPROVED"] = "VERIFICATION_APPROVED";
    NotificationType["VERIFICATION_REJECTED"] = "VERIFICATION_REJECTED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
//# sourceMappingURL=types.js.map