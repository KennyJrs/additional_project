import './App.css';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';

function App() {
    const [year, setYear] = useState('');  // початкове значення року - '', тому, щоб графік з'явився, нам потрібно вибрати рік        // об'явлення потрібних нам функцій
    const [chartData, setChartData] = useState(null);  // початкові дані для побудови графіка теж null
    const [data, setData] = useState([]);    // початкові дані, які ми завантажуємо з csv файлу, теж дорівнюють пустому масиву

    useEffect(() => {                                      // кожного разу, коли змінюється значення year, виконуємо наступні дії:
        const fetchData = async () => {
            try {                                                        
                const response = await fetch(`./Data.csv`);                     // витягуємо дані з файлу, декодуємо, передаємо до стану data з включеними заголовками                 
                const reader = response.body.getReader();
                const result = await reader.read();
                const decoder = new TextDecoder('utf-8');
                const csv = decoder.decode(result.value);
                const parsedData = Papa.parse(csv, { header: true }).data;
                setData(parsedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [year]);

    useEffect(() => {
        if (data.length > 0 && year) {
            const filteredData = data.filter((entry) => entry.DATE.startsWith(year));  // за допомогою фільтру вибираємо необхідні нам роки. Так як у .csv файлі
            const labels = filteredData.map((entry) => entry.DATE);                           // формат дати являє собою "yyyy-mm-dd", то нам потрібно вибрати лише ті,
            const values = filteredData.map((entry) => parseFloat(entry.PCOPPUSDM));          // які починаються з потрібного нам року, який вказано у параметрі value у option
            setChartData({
                labels: labels,                 // налаштовуємо графік за допомогою отриманих вище даних з необхідних атрибутів .csv файлу
                datasets: [
                    {
                        label: 'Copper price per ton(USD)',
                        data: values,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                    },
                ],
            });
        }
    }, [data]);

    useEffect(() => {
        if (chartData) {
            const ctx = document.getElementById('myChart');
            if (ctx) {                                      // перевіряємо на існування графік, щоб уникнути помилки. Якщо такий вже існує - видаляємо його
                const existingChart = Chart.getChart(ctx);
                if (existingChart) {
                    existingChart.destroy();
                }
            }
            new Chart(ctx, {                                // створюємо новий графік
                type: 'line',
                data: chartData,
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'month',
                            },
                        },
                    },
                },
            });
        }
    }, [chartData]);

    const handleYearChange = (event) => {               // при виборі значення у select виклик функції setYear
        setYear(event.target.value);
    };

    return (
        <div className="App">
            <div className="gradient-background">
                <img className="department-img" src="./department.png" alt="Department logo."></img>
                <h1>Copper price on the world market</h1>
                <label htmlFor="year">Select Year: </label>

                <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">--Select year--</option>
                    <option value="1990">1990</option>
                    <option value="1991">1991</option>
                    <option value="1992">1992</option>
                    <option value="1993">1993</option>
                    <option value="1994">1994</option>
                    <option value="1995">1995</option>
                    <option value="1996">1996</option>
                    <option value="1997">1997</option>
                    <option value="1998">1998</option>
                    <option value="1999">1999</option>
                    <option value="2000">2000</option>
                    <option value="2001">2001</option>
                    <option value="2002">2002</option>
                    <option value="2003">2003</option>
                    <option value="2004">2004</option>
                    <option value="2005">2005</option>
                    <option value="2006">2006</option>
                    <option value="2007">2007</option>
                    <option value="2008">2008</option>
                    <option value="2009">2009</option>
                    <option value="2010">2010</option>
                    <option value="2011">2011</option>
                    <option value="2012">2012</option>
                    <option value="2013">2013</option>
                    <option value="2014">2014</option>
                    <option value="2015">2015</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                </select>

                <div>
                    <canvas id="myChart"></canvas>
                </div>
            </div>
        </div>
    );
}

export default App;
