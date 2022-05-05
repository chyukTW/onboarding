import { useSubscription } from "@apollo/client";
import { WORD_SUBSCRIPTION } from "../graphql/words/subscription";

const Word = () => {
  const { data, loading } = useSubscription(WORD_SUBSCRIPTION);

  return (
    <div>Random Word: {!loading && data?.randomWord}</div>
  )
};

export default Word;