# Reviews Module Documentation

## Overview

The Reviews module provides a comprehensive rating and review system for the Fixelo marketplace. It allows clients to rate and review completed services, and providers to respond to reviews. The system includes statistics, filtering, and validation features.

## Features

### Review Management
- **Create Reviews**: Clients can review completed bookings (1-5 stars + comment)
- **Update Reviews**: Clients can edit their own reviews
- **Delete Reviews**: Clients can delete their own reviews
- **Provider Responses**: Providers can respond to reviews about their services

### Statistics & Analytics
- **Provider Stats**: Average rating, total reviews, rating distribution
- **Service Stats**: Statistics per individual service
- **Rating Calculations**: Automatic rating updates for providers
- **Review Counts**: Track total review counts per provider

### Security & Validation
- **Booking Validation**: Only completed bookings can be reviewed
- **Ownership Validation**: Users can only modify their own reviews/responses
- **Duplicate Prevention**: One review per booking per client
- **Role-based Access**: Clients create reviews, providers respond

## API Endpoints

### Review Management

#### Create Review (Clients Only)
```http
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent service! Very professional and thorough.",
  "bookingId": "clh123..."
}
```

**Response:**
```json
{
  "id": "review123",
  "rating": 5,
  "comment": "Excellent service! Very professional and thorough.",
  "response": null,
  "bookingId": "clh123...",
  "client": {
    "id": "client123",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatar.jpg"
  },
  "provider": {
    "id": "provider123",
    "firstName": "Jane",
    "lastName": "Smith",
    "businessName": "Smith Cleaning Services",
    "avatar": "https://example.com/provider.jpg"
  },
  "service": {
    "id": "service123",
    "title": "House Cleaning",
    "category": "HOUSE_CLEANING"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Update Review (Clients Only)
```http
PUT /api/reviews/{reviewId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Good service, but could be improved."
}
```

#### Delete Review (Clients Only)
```http
DELETE /api/reviews/{reviewId}
Authorization: Bearer <token>
```

#### Add Provider Response (Providers Only)
```http
POST /api/reviews/{reviewId}/response
Authorization: Bearer <token>
Content-Type: application/json

{
  "response": "Thank you for your feedback! We appreciate your business and will continue to improve our services."
}
```

### Review Retrieval

#### Get Reviews with Filters
```http
GET /api/reviews?rating=5&providerId=provider123&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `rating` (optional): Filter by rating (1-5)
- `serviceId` (optional): Filter by service ID
- `providerId` (optional): Filter by provider ID
- `clientId` (optional): Filter by client ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**
```json
{
  "reviews": [
    {
      "id": "review123",
      "rating": 5,
      "comment": "Excellent service!",
      "response": "Thank you for your feedback!",
      "bookingId": "booking123",
      "client": { ... },
      "provider": { ... },
      "service": { ... },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

#### Get Single Review
```http
GET /api/reviews/{reviewId}
Authorization: Bearer <token>
```

### Statistics

#### Get Provider Statistics
```http
GET /api/reviews/providers/{providerId}/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "averageRating": 4.6,
  "totalReviews": 47,
  "ratingDistribution": {
    "1": 1,
    "2": 2,
    "3": 5,
    "4": 15,
    "5": 24
  }
}
```

#### Get Service Statistics
```http
GET /api/reviews/services/{serviceId}/stats
Authorization: Bearer <token>
```

### Personal Reviews

#### Get My Given Reviews (Clients)
```http
GET /api/reviews/my/given?page=1&limit=10
Authorization: Bearer <token>
```

#### Get My Received Reviews (Providers)
```http
GET /api/reviews/my/received?page=1&limit=10
Authorization: Bearer <token>
```

## Data Models

### Review
```typescript
interface Review {
  id: string;
  rating: number; // 1-5
  comment?: string;
  response?: string; // Provider response
  bookingId: string;
  clientId: string;
  providerId: string;
  serviceId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  client: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    businessName?: string;
    avatar?: string;
  };
  service: {
    id: string;
    title: string;
    category: string;
  };
}
```

### Review Statistics
```typescript
interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
```

## Frontend Integration

### React/Next.js Example

```typescript
import { useState, useEffect } from 'react';
import { Star, StarFill } from 'react-bootstrap-icons';

interface ReviewFormProps {
  bookingId: string;
  onReviewSubmitted: (review: Review) => void;
}

export function ReviewForm({ bookingId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReview = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rating,
          comment,
          bookingId
        })
      });

      if (response.ok) {
        const review = await response.json();
        onReviewSubmitted(review);
        setRating(0);
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form">
      <h3>Rate this service</h3>
      
      <div className="rating-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="star-button"
          >
            {star <= rating ? <StarFill /> : <Star />}
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        rows={4}
        className="comment-input"
      />

      <button
        onClick={submitReview}
        disabled={rating === 0 || isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
}

// Review Display Component
interface ReviewListProps {
  providerId: string;
}

export function ReviewList({ providerId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [providerId]);

  const loadReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?providerId=${providerId}`);
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/reviews/providers/${providerId}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="review-list">
      {stats && (
        <div className="review-stats">
          <h3>Reviews ({stats.totalReviews})</h3>
          <div className="average-rating">
            <span className="rating-number">{stats.averageRating.toFixed(1)}</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= Math.round(stats.averageRating) ? <StarFill /> : <Star />}
                </span>
              ))}
            </div>
          </div>
          
          <div className="rating-distribution">
            {Object.entries(stats.ratingDistribution).reverse().map(([rating, count]) => (
              <div key={rating} className="rating-bar">
                <span>{rating} stars</span>
                <div className="bar">
                  <div 
                    className="fill" 
                    style={{ width: `${(count / stats.totalReviews) * 100}%` }}
                  />
                </div>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="reviews">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="client-info">
          <img src={review.client.avatar || '/default-avatar.png'} alt="Client" />
          <span>{review.client.firstName} {review.client.lastName}</span>
        </div>
        
        <div className="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star}>
              {star <= review.rating ? <StarFill /> : <Star />}
            </span>
          ))}
        </div>
        
        <span className="date">{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>

      {review.comment && (
        <p className="review-comment">{review.comment}</p>
      )}

      {review.response && (
        <div className="provider-response">
          <strong>Response from {review.provider.businessName || `${review.provider.firstName} ${review.provider.lastName}`}:</strong>
          <p>{review.response}</p>
        </div>
      )}
    </div>
  );
}
```

### React Native Example

```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReviewFormProps {
  bookingId: string;
  onReviewSubmitted: (review: Review) => void;
}

export function ReviewForm({ bookingId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReview = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rating,
          comment,
          bookingId
        })
      });

      if (response.ok) {
        const review = await response.json();
        onReviewSubmitted(review);
        setRating(0);
        setComment('');
        Alert.alert('Success', 'Review submitted successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate this service</Text>
      
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={32}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.commentInput}
        value={comment}
        onChangeText={setComment}
        placeholder="Share your experience..."
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        style={[styles.submitButton, { opacity: rating === 0 || isSubmitting ? 0.5 : 1 }]}
        onPress={submitReview}
        disabled={rating === 0 || isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  starButton: {
    padding: 5,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

## Business Logic

### Review Validation Rules

1. **Booking Status**: Only `COMPLETED` bookings can be reviewed
2. **Client Only**: Only the client who booked the service can create a review
3. **One Review Per Booking**: Each booking can only have one review
4. **Rating Range**: Rating must be between 1 and 5
5. **Provider Response**: Only the service provider can respond to reviews

### Rating Calculation

The system automatically updates provider ratings when reviews are created, updated, or deleted:

```typescript
// Automatic rating update logic
const updateProviderRating = async (providerId: string) => {
  const reviews = await prisma.review.findMany({
    where: { providerId },
    select: { rating: true }
  });

  if (reviews.length === 0) {
    await prisma.user.update({
      where: { id: providerId },
      data: { rating: 0, reviewCount: 0 }
    });
    return;
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  await prisma.user.update({
    where: { id: providerId },
    data: {
      rating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
      reviewCount: reviews.length
    }
  });
};
```

## Testing

### Unit Tests

```typescript
describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ReviewsService, PrismaService],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a review for completed booking', async () => {
    const mockBooking = {
      id: 'booking1',
      clientId: 'client1',
      providerId: 'provider1',
      serviceId: 'service1',
      status: 'COMPLETED',
      reviews: []
    };

    jest.spyOn(prisma.booking, 'findUnique').mockResolvedValue(mockBooking);
    jest.spyOn(prisma.review, 'create').mockResolvedValue({
      id: 'review1',
      rating: 5,
      comment: 'Great service!',
      bookingId: 'booking1',
      clientId: 'client1',
      providerId: 'provider1',
      serviceId: 'service1',
      response: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.createReview('client1', {
      rating: 5,
      comment: 'Great service!',
      bookingId: 'booking1'
    });

    expect(result.rating).toBe(5);
    expect(result.comment).toBe('Great service!');
  });

  it('should not allow review for non-completed booking', async () => {
    const mockBooking = {
      id: 'booking1',
      clientId: 'client1',
      providerId: 'provider1',
      serviceId: 'service1',
      status: 'PENDING',
      reviews: []
    };

    jest.spyOn(prisma.booking, 'findUnique').mockResolvedValue(mockBooking);

    await expect(
      service.createReview('client1', {
        rating: 5,
        comment: 'Great service!',
        bookingId: 'booking1'
      })
    ).rejects.toThrow('Can only review completed bookings');
  });
});
```

### Integration Tests

```typescript
describe('ReviewsController (e2e)', () => {
  let app: INestApplication;
  let clientToken: string;
  let providerToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Setup test tokens
    clientToken = await getTestToken('client');
    providerToken = await getTestToken('provider');
  });

  it('/reviews (POST) - should create review', () => {
    return request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        rating: 5,
        comment: 'Excellent service!',
        bookingId: 'test-booking-id'
      })
      .expect(201);
  });

  it('/reviews/:id/response (POST) - should add provider response', () => {
    return request(app.getHttpServer())
      .post('/reviews/test-review-id/response')
      .set('Authorization', `Bearer ${providerToken}`)
      .send({
        response: 'Thank you for your feedback!'
      })
      .expect(200);
  });
});
```

## Security Considerations

1. **Role-based Access**: Strict role verification for review creation and responses
2. **Ownership Validation**: Users can only modify their own reviews/responses
3. **Booking Validation**: Thorough validation of booking status and ownership
4. **Input Sanitization**: Sanitize review comments and responses
5. **Rate Limiting**: Implement rate limiting to prevent spam reviews

## Performance Optimization

1. **Database Indexing**: Proper indexing on providerId, serviceId, and bookingId
2. **Caching**: Cache frequently accessed statistics
3. **Pagination**: Efficient pagination for large review lists
4. **Aggregation**: Use database aggregation for statistics calculation
5. **Lazy Loading**: Load related data only when needed

## Analytics & Insights

The review system provides valuable analytics:

- **Provider Performance**: Track rating trends over time
- **Service Quality**: Identify top-performing services
- **Customer Satisfaction**: Monitor overall platform satisfaction
- **Feedback Analysis**: Analyze common themes in reviews
- **Response Rate**: Track provider response rates to reviews

## Future Enhancements

1. **Review Moderation**: Implement automated content moderation
2. **Review Verification**: Verify reviews from actual bookings
3. **Review Incentives**: Reward system for leaving reviews
4. **Review Templates**: Quick review options for common feedback
5. **Review Analytics**: Advanced analytics dashboard for providers
6. **Review Notifications**: Real-time notifications for new reviews
7. **Review Disputes**: System for handling disputed reviews
8. **Review Sentiment Analysis**: AI-powered sentiment analysis
9. **Review Highlights**: Extract key highlights from reviews
10. **Review Recommendations**: Suggest improvements based on feedback 