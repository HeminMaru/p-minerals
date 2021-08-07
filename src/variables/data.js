import Apollo from "../Apollo";
import { Forms } from '../graphql';

function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}



const getProductData = (parameter) => {
    var data = [];
    Apollo.query(Forms.getDailyAnalysis, {}, res => {
        if (parameter === "label") {
            for (var i = 0; i < res.data.products.length; i++) {
                data.push(res.data.products[i].product_name);
            }
        } else if (parameter === "net_stock") {
            for (var i = 0; i < res.data.products.length; i++) {
                data.push(res.data.products[i].net_stock);
            }
        }
    });
    return data;
};


export const DailyStockData = {
    data: (canvas) => {
        var ctx = canvas.getContext("2d");
        var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
        gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
        gradientFill.addColorStop(1, hexToRGB("#2CA8FF", 0.6));
        return {
            labels: getProductData("label"),
            datasets: [{
                label: "Net Stock",
                backgroundColor: gradientFill,
                borderColor: "#2CA8FF",
                pointBorderColor: "#FFF",
                pointBackgroundColor: "#2CA8FF",
                pointBorderWidth: 2,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 1,
                pointRadius: 4,
                fill: true,
                borderWidth: 1,
                data: getProductData("net_stock"),
            }, ],
        };
    },
    options: {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltips: {
                bodySpacing: 4,
                mode: "nearest",
                intersect: 0,
                position: "nearest",
                xPadding: 10,
                yPadding: 10,
                caretPadding: 10,
            },
        },
        responsive: 1,
        scales: {
            y: {
                ticks: {
                    maxTicksLimit: 7,
                },
                grid: {
                    zeroLineColor: "transparent",
                    drawBorder: false,
                },
            },
            x: {
                display: 0,
                ticks: {
                    display: false,
                },
                grid: {
                    zeroLineColor: "transparent",
                    drawTicks: false,
                    display: false,
                    drawBorder: false,
                },
            },
        },
        layout: {
            padding: { left: 0, right: 0, top: 15, bottom: 15 },
        },
    },
};