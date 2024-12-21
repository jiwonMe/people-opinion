'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Share2 } from 'lucide-react';

export function ReviewForm({ formData, onBack }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  async function onSubmit() {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');

      toast({
        title: 'Success!',
        description: 'Your opinion has been submitted successfully.',
      });

      // Reset form or redirect
      window.location.href = '/';
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit your opinion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="font-semibold">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <span className="text-sm text-muted-foreground">Name</span>
              <p>{formData.name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Gender</span>
              <p>{formData.gender}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Age</span>
              <p>{formData.age}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Address</span>
              <p>{formData.address}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Your Opinion</h3>
          <p className="mt-2 whitespace-pre-wrap">{formData.opinion}</p>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              navigator.share({
                title: 'My Opinion Submission',
                text: formData.opinion,
                url: window.location.href,
              }).catch(() => {
                toast({
                  description: 'Sharing is not supported on this device',
                });
              });
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Opinion'}
          </Button>
        </div>
      </div>
    </div>
  );
}