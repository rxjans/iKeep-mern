import {React, useState, useEffect} from 'react';
import Header from '../components/header';
import { useLocation } from 'react-router-dom';
import DashProfile from '../components/DashProfile';
import DashSidebar from '../components/DashSidebar';

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(()=> {
    const params = new URLSearchParams(location.search);
    const tabsFromUrl = params.get('tab');
    if(tabsFromUrl){
      setTab(tabsFromUrl);
    }
  }, [location.search])


  return (

    <>
    <Header />
      {/* sidebar */}
      <div className='min-h-screen flex flex-col lg:flex-row'>
        <div>
          <DashSidebar />
        </div>
        {/* profile */}
        <div className='w-full min-h-[700px] lg:min-h-screen'>
          {
            tab === 'profile' && <DashProfile />
          }
        </div>
      </div>
    </>
  )

}

export default Dashboard
