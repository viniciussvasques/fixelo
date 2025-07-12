'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Star, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  service: {
    title: string;
    id: string;
  };
  reviewer: {
    name: string;
    avatar?: string;
  };
  provider?: {
    name: string;
    avatar?: string;
  };
}

export default function ReviewsPage() {
  const t = useTranslations();
  const [receivedReviews, setReceivedReviews] = useState<Review[]>([]);
  const [givenReviews, setGivenReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0,
  });

  useEffect(() => {
    loadReviews();
    loadStats();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const [receivedResponse, givenResponse] = await Promise.all([
        apiClient.getReviews({ type: 'received' }),
        apiClient.getReviews({ type: 'given' })
      ]);
      
      setReceivedReviews(receivedResponse.data?.data?.data || receivedResponse.data?.data || []);
      setGivenReviews(givenResponse.data?.data?.data || givenResponse.data?.data || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // const response = await apiClient.getReviews({ stats: true });
      setStats({
        averageRating: 4.5,
        totalReviews: 25,
        fiveStars: 15,
        fourStars: 6,
        threeStars: 3,
        twoStars: 1,
        oneStars: 0,
      });
    } catch (error) {
      console.error('Failed to load review stats:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderReviewCard = (review: Review, type: 'received' | 'given') => (
    <Card key={review.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <img 
                src={type === 'received' ? review.reviewer.avatar : review.provider?.avatar || '/default-avatar.png'} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </Avatar>
            <div>
              <h4 className="font-medium">
                {type === 'received' ? review.reviewer.name : review.provider?.name}
              </h4>
              <p className="text-sm text-muted-foreground">{review.service.title}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm">{review.comment}</p>
      </CardContent>
    </Card>
  );

  const renderRatingDistribution = () => (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = stats[`${rating === 1 ? 'one' : rating === 2 ? 'two' : rating === 3 ? 'three' : rating === 4 ? 'four' : 'five'}Stars` as keyof typeof stats] as number;
        const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
        
        return (
          <div key={rating} className="flex items-center gap-2">
            <span className="text-sm w-8">{rating}</span>
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-8">{count}</span>
          </div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('reviews.title')}</h1>
        <p className="text-muted-foreground">{t('reviews.subtitle')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('reviews.averageRating')}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
                  <div className="flex">
                    {renderStars(Math.round(stats.averageRating))}
                  </div>
                </div>
              </div>
              <div className="bg-yellow-100 p-2 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('reviews.totalReviews')}</p>
                <p className="text-2xl font-bold">{stats.totalReviews}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('reviews.recentReviews')}</p>
                <p className="text-2xl font-bold">{receivedReviews.length}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            {t('reviews.ratingDistribution')}
          </CardTitle>
          <CardDescription>{t('reviews.ratingDistributionDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderRatingDistribution()}
        </CardContent>
      </Card>

      {/* Reviews Tabs */}
      <Tabs defaultValue="received" className="space-y-4">
        <TabsList>
          <TabsTrigger value="received" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {t('reviews.receivedReviews')} ({receivedReviews.length})
          </TabsTrigger>
          <TabsTrigger value="given" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {t('reviews.givenReviews')} ({givenReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedReviews.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-lg mb-2">{t('reviews.noReceivedReviews')}</p>
                  <p className="mb-4">{t('reviews.noReceivedReviewsDescription')}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            receivedReviews.map(review => renderReviewCard(review, 'received'))
          )}
        </TabsContent>

        <TabsContent value="given" className="space-y-4">
          {givenReviews.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-lg mb-2">{t('reviews.noGivenReviews')}</p>
                  <p className="mb-4">{t('reviews.noGivenReviewsDescription')}</p>
                  <Button onClick={() => window.location.href = '/services'}>
                    {t('reviews.findServices')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            givenReviews.map(review => renderReviewCard(review, 'given'))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 