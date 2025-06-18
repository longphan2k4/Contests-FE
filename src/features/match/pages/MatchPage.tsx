import { useEffect } from 'react';
import MatchHeader from "../../../layouts/MatchLayout/MatchHeader";
import QuestionDisplay from "../components/QuestionDisplay/Index";

export default function MatchPage() {
  useEffect(() => {
    document.title = 'Theo dõi trận đấu - Olympic Tin học.';
  }, []);

  return (
    <>
        <MatchHeader />
        <QuestionDisplay />
    </>
  )
}