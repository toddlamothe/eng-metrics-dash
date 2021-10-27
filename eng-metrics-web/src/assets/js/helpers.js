export function formatAsPercent(rawValue) {
    return parseFloat( (rawValue + 0) * 100 ).toFixed(2);
}
  
// Return 1 of 10 random colors
export function genColor() {
    const backgroundColorSet = [
        'rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)','rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 159, 64, 0.2)',
    ];

    const borderColorSet = [
        'rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)','rgba(255, 159, 64, 1)','rgba(255, 159, 64, 1)',        
    ]

    const colorIndex = Math.round(Math.random() * 20);
    return {
        backgroundColor: backgroundColorSet[colorIndex],
        borderColor: borderColorSet[colorIndex],
    };
}