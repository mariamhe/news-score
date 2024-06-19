'use client';

import { useForm } from "react-hook-form"
import {useState} from "react";

// This is a quick implementation, so some of the things that should be added in a real application would be:
// Translations
// Create component for Button (types, etc)
// Should show concrete errors when clicking submit and there are errors in form (now it's just red)
// Error-handling from API
// Route handling
// CSS: Set tailwind standards for colors etc.
interface Measurements {
  bodyTemperature: number;
  heartRate: number;
  respiratoryRate: number;
}

interface NewsScore {
  score: number;
}

export default function NewsScore() {

  const { register, handleSubmit, reset } = useForm<Measurements>();
  const [newsScore, setNewsScore] = useState<NewsScore | undefined>(undefined);

  // For bigger applications, I'd move this to route.ts (route handling)
  const submitValues = (data: Measurements) => {
    console.log("Data: ", data);

    fetch('http://127.0.0.1:5000/news_score', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        measurements: [
          {
            type: "TEMP",
            value: data?.bodyTemperature
          },
          {
            type: "HR",
            value: data?.heartRate
          },
          { type: "RR", value: data?.respiratoryRate }
        ]
      })
    })
        .then(res => res.json())
        .then((res: NewsScore) => {
          setNewsScore(res)
        }).catch((err) => {
      // Handle error (show user toast etc)
      console.error(err)
    })
  };

  const handleReset = () => {
    setNewsScore(undefined)
    reset();
  }

  return (
      <form className='flex flex-col gap-10 p-20' onSubmit={handleSubmit(submitValues)}>
        <h4>NEWS score calculator</h4>

        {/* Body temperature */}
        <div className='flex flex-col gap-3'>
          <h3>Body temperature</h3>
          <div>Degrees celsius</div>
          <input type="number" {...register('bodyTemperature', { required: true, min: 32, max: 42 })} />
        </div>

        {/* Heartrate */}
        <div className='flex flex-col gap-3'>
          <h3>Heartrate</h3>
          <div>Beats per minute</div>
          <input type="number" {...register('heartRate', {required: true, min: 26, max: 220})} />
        </div>

        {/* Respiratory rate */}
        <div className='flex flex-col gap-3'>
          <h3>Respiratory rate</h3>
          <div>Breaths per minute</div>
          <input type="number" {...register('respiratoryRate', {required: true, min: 4, max: 60})} />
        </div>


        {/* Button row */}
        <div className='flex gap-6'>
          <button type='submit' className='rounded-full text-white bg-[#7424DA] py-2 px-4'>Calculate NEWS score</button>
          <button type='button' onClick={handleReset}  className='rounded-full py-2 px-4 bg-[#FAF6FF]'>Reset form</button>
        </div>

        {/* Results */}
        {newsScore && <div className='rounded-[10px] bg-[#FAF6FF] border-[#7424DA] border-opacity-40 border-[1px] p-4 flex gap-1 text-xl'>
          NEWS score: <p className='font-bold'>{newsScore.score}</p>
        </div>}
      </form>
  );
}