import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60000,
  limit: 60, //gui toi da 60 request trong 60000ms, neu qua thi bi chan
  standardHeaders: 'draft-8', //Dùng theo IETF draft standard, Trả về các header như RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset.
  legacyHeaders: false, //Không sử dụng header cũ như X-RateLimit-* nữa (cái này đã deprecated).
  message: {
    error:
      'you have sent too many requests in a given amount of time. Please try again later.',
  },
});

export default limiter;
