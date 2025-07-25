let API_CS_URL = "https://script.google.com/macros/s/AKfycbz0A48OfPDoZTQ3AHqJZfaVsq-R-a21BFjr1047X2duCC7CWZwHBVtS1a0l6BjfYABK/exec?action=read";
let API_SP_URL = "https://script.google.com/macros/s/AKfycbypSGwxoeb6etcmxswpijkqTgFCE8xxz4sYNMXhS358uVJUKqr79Xs6IKBhJBJjdqla/exec?action=read";
let API_PD_URL = "https://script.google.com/macros/s/AKfycbwhaTdN_5Efrlt42FbGDmjnRgrHVCZYtJ-WjscZBfBoQL9x7fP6XfqAy2iIqPMjYb8I/exec?action=read";
let API_US_URL = "https://script.google.com/macros/s/AKfycbwIPnH9_NT5w-F-znQypP5dRPdSY8k9zZNZNvhJpyAtBZOgheEpdPnJtVp0f0A7wu-v/exec/exec?action=read";


//=============== Meymey javaScript================///
//======= Catch name and role to welcome=============
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
      data: [4, 6, 1, 2, 40, 25],
    },
  ],
  xaxis: {
    categories: ["Products", "User", "Customer", "Supplier"],
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
                  return 13
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
      document.getElementById('total-supplier').innerHTML += result.data.length;
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
      document.getElementById('total-customer').innerHTML += result.data.length;
    }
  } catch (err) {
    console.error('Failed to load Customer:', err);
  }
}
async function loadUserCount() {
  try {
    const res = await fetch(API_US_URL);
    const result = await res.json();
    if (result.status === 'success') {
      document.getElementById('total-user').innerHTML += result.data.length;
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
      document.getElementById('total-product').innerHTML += result.data.length;
    }
  } catch (err) {
    console.error('Failed to load product:', err);
  }
}
async function loadCustomerCount() {
  try {
    const res = await fetch(API_CS_URL);
    const result = await res.json();
    if (result.status === 'success') {
      document.getElementById('total-customer').innerHTML += result.data.length;
    }
  } catch (err) {
    console.error('Failed to load customer:', err);
  }
}
function welcome() {
  let name = document.getElementById(hi);
    fetch(`${API_US_URL}`)
    .then(res => res.json())
    .then(data => {
      name.innerHTML = "";
      data.data.forEach(user => {
        const li = document.createElement("ul");

        ul.innerHTML = `
          ${user.name}
        `;

        row.appendChild(tr);
      });
    });
}
welcome();
loadCustomerCount();
loadProductCount();
loadUserCount();
loadSupplierCount();
