"use client";

import React from 'react';
import { createAttestation } from './UpvoteDownVote';
import styles from './ResultCard.module.css';

interface ResultCardProps {
  description: string;
  amount: string;
  upvotes: number;
  downvotes: number;
  uid: string; // Include the UID field
}

const ResultCard: React.FC<ResultCardProps> = ({
  description,
  amount,
  upvotes,
  downvotes,
  uid
}) => {
  const handleUpvote = () => {
    createAttestation(uid, true);
  };

  const handleDownvote = () => {
    createAttestation(uid, false);
  };

  return (
    <div className={styles.card}>
      <p className={styles.description}>{description}</p>
      <div className={styles.amount}>{amount} USDC</div>
      <div className={styles.actions}>
        <button className={styles.upvote} onClick={handleUpvote}>
          <span className={styles.icon}>🟢</span> Upvote ({upvotes})
        </button>
        <button className={styles.downvote} onClick={handleDownvote}>
          <span className={styles.icon}>🔴</span> Downvote ({downvotes})
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
