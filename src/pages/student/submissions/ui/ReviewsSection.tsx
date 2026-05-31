import { useTranslation } from "react-i18next";

interface ReviewItem {
  id: string;
  mark: number;
  comment: string;
}

interface ReviewsSectionProps {
  reviews: ReviewItem[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const { t } = useTranslation();
  return (
    <section className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-base font-medium text-foreground mb-3">
        {t("student.submissions.reviewsTitle")}
      </h2>
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">{t("student.submissions.noReviews")}</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <ReviewRow key={review.id} review={review} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ReviewRow({ review }: { review: ReviewItem }) {
  const { t } = useTranslation();
  return (
    <li className="rounded-2md bg-muted p-4">
      <div className="mb-2 text-13 font-medium text-brand-primary">
        {t("student.submissions.reviewMark")}: {review.mark} / 5
      </div>
      <p className="text-sm text-foreground whitespace-pre-wrap leading-[1.5]">{review.comment}</p>
    </li>
  );
}
