import ResultCard from "@/components/ui/ResultCard";

interface NotesProps {
  allNotes: {
    note: string;
    amount: string;
    upvotes: number;
    downvotes: number;
    uid: string;
  }[];
}

export default function Notes({ allNotes }: NotesProps) {
  return (
    <div>
      <div>
        <h1
          className="text-white text-4xl font-bold text-center"
        >
          cookiejar/compound-dao
        </h1>
        <div
          className="gap-3 grid grid-cols-3"
        >
          {allNotes.map((item, index) => (
            <ResultCard
              key={index}
              description={item.note} // Use the correct property name
              amount={item.amount}
              upvotes={item.upvotes}
              downvotes={item.downvotes}
              uid={item.uid}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
