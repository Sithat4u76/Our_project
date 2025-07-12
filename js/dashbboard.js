let API_CS_URL = "https://script.google.com/macros/s/AKfycbz0A48OfPDoZTQ3AHqJZfaVsq-R-a21BFjr1047X2duCC7CWZwHBVtS1a0l6BjfYABK/exec?action=read";
let API_SP_URL = "https://script.google.com/macros/s/AKfycbypSGwxoeb6etcmxswpijkqTgFCE8xxz4sYNMXhS358uVJUKqr79Xs6IKBhJBJjdqla/exec?action=read";
let API_PD_URL = "https://script.google.com/macros/s/AKfycbwhaTdN_5Efrlt42FbGDmjnRgrHVCZYtJ-WjscZBfBoQL9x7fP6XfqAy2iIqPMjYb8I/exec?action=read";
let API_US_URL = "script.google.com/macros/s/AKfycbwIPnH9_NT5w-F-znQypP5dRPdSY8k9zZNZNvhJpyAtBZOgheEpdPnJtVp0f0A7wu-v/exec/exec?action=read";


//=============== Meymey javaScript================///
//======= Catch name and role to welcome=============
const hi = document.getElementById("hi");
hi.innerHTML = `${localStorage.getItem("name")}(${localStorage.getItem(
  "role"
)})<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="red"><path d="M480-720q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720ZM360-80v-520q-60-5-122-15t-118-25l20-80q78 21 166 30.5t174 9.5q86 0 174-9.5T820-720l20 80q-56 15-118 25t-122 15v520h-80v-240h-80v240h-80Z"/></svg>`;
//   ======= Catch name and role to welcome=============

//==============Chart=========================\\\
var options1 = {
  chart: {
    type: "area",
    height: 350,
  },
  series: [
    {
      name: "Users",
      data: [10, 20, 15, 30, 40, 25],
    },
  ],
  xaxis: {
    categories: ["Products", "User", "Customer", "Earning"],
  },
  colors: ["#1c90d7"],
};

var chart1 = new ApexCharts(document.querySelector("#chart1"), options1);
chart1.render();
var options2 = {
          series: [44, 55, 67, 83],
          chart: {
          height: 350,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '22px',
              },
              value: {
                fontSize: '16px',
              },
              total: {
                show: true,
                label: 'Total',
                formatter: function (w) {
                  // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                  return 249
                }
              }
            }
          }
        },
        labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
        };

        var chart2 = new ApexCharts(document.querySelector("#chart2"), options2);
        chart2.render();


        function generateDayWiseTimeSeries(baseval, count, yrange) {
  let i = 0;
  const series = [];
  while (i < count) {
    const x = baseval;
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    series.push([x, y]);
    baseval += 86400000; // add one day (in ms)
    i++;
  }
  return series;
}

      
        var options3 = {
          series: [
          {
            name: 'South',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
              min: 10,
              max: 60
            })
          },
          {
            name: 'North',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
              min: 10,
              max: 20
            })
          },
          {
            name: 'Central',
            data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
              min: 10,
              max: 15
            })
          }
        ],
          chart: {
          type: 'area',
          height: 350,
          stacked: true,
          events: {
            selection: function (chart, e) {
              console.log(new Date(e.xaxis.min))
            }
          },
        },
        colors: ['#008FFB', '#00E396', '#CED4DC'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'monotoneCubic'
        },
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left'
        },
        xaxis: {
          type: 'datetime'
        },
        };

        var chart3 = new ApexCharts(document.querySelector("#chart3"), options3);
        chart3.render();
      
//==============Chart=========================\\\


async function loadSupplierCount() {
  try {
    const res = await fetch(API_SP_URL);
    const result = await res.json();
    if (result.status === 'success') {
      document.getElementById('total-supplier').textContent = result.data.length;
    }
  } catch (err) {
    console.error('Failed to load suppliers:', err);
  }
}
async function loadCustomerCount() {
  try {
    const res = await fetch(API_CS_URL);
    const result = await res.json();
    if (result.status === 'success') {
      document.getElementById('total-customer').textContent = result.data.length;
    }
  } catch (err) {
    console.error('Failed to load Customer:', err);
  }
}
async function loadSupplierCount() {
  try {
    const res = await fetch(API_US_URL);
    const result = await res.json();
    if (result.status === 'success') {
      document.getElementById('total-user').textContent = result.data.length;
    }
  } catch (err) {
    console.error('Failed to load user:', err);
  }
}
async function loadProductCount() {
  try {
    const res = await fetch(API_PD_URL);
    const result = await res.json();
    if (result.status === 'success') {
      document.getElementById('total-product').textContent = result.data.length;
    }
  } catch (err) {
    console.error('Failed to load product:', err);
  }
}
async function loadCustomerCount() {
  try {
    const res = await fetch(SUPPLIER_API_URL);
    const result = await res.json();
    if (result.status === 'success') {
      document.getElementById('total-supplier').textContent = result.data.length;
    }
  } catch (err) {
    console.error('Failed to load suppliers:', err);
  }
}
