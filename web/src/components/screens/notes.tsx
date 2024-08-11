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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: "Patrick Hand",
      }}
    >
      <div
        style={{
          padding: "20px",
          maxWidth: "1000px",
          width: "100%",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "24px",
            marginBottom: "20px",
            color: "#333",
            textTransform: "lowercase",
          }}
        >
          cookiejar/compound-dao
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Increased card width
            gap: "20px",
          }}
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
