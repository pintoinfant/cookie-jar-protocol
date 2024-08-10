import React from 'react';

const DonutChart = ({ val1, val2 }: { val1: number, val2: number }) => {
    // Ensure val2 is greater than 0 to avoid division by zero
    const validVal2 = Math.max(val2, 1);

    // Calculate the percentage of val1 relative to val2
    const percentage = (val1 / validVal2) * 100;

    // Define segment colors
    const filledColor = '#3F3F46'; // Color for the filled portion
    const emptyColor = '#F4F4F5';  // Color for the unfilled portion

    // Create the conic-gradient string
    const gradient = `
    conic-gradient(
      ${filledColor} 0% ${percentage}%, 
      ${emptyColor} ${percentage}% 100%
    )
  `;

    return (
        <div
            className="relative w-56 h-56 rounded-full"
            style={{
                background: gradient,
            }}
        >
            <div
                className="absolute top-1/2 left-1/2 w-3/5 h-3/5 bg-white rounded-full"
                style={{
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <div className="flex items-center justify-center h-full text-gray-700 text-lg font-bold">
                    {`${val1} / ${val2}`}
                </div>
            </div>
        </div>
    );
};

export default DonutChart;
