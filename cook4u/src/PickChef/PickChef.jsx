import React from 'react'
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getChefById } from './chefService';
import HeaderClient from '../Client/HeaderClient';
import ChefHeader from './ChefHeader';
import ChefFavoriteDishes from './ChefFavoriteDishes';
import ChefTabs from './ChefTabs';


const PickChef = () => {
    const {chefId} = useParams();
    console.log("chefId:", chefId);
    const [chef, setChef] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChef = async () => {
            try {
                const data = await getChefById(chefId);
                console.log("Kết quả fetch:", data);
                setChef(data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin đầu bếp:", error);
                setLoading(false);
            }
        };
        fetchChef();
    }, [chefId]);


if(loading) return <div className='text-black'>Đang tải dữ liệu</div>;

if(!chef) return <div className='text-black'>Đầu bếp không tồn tại</div>;

  return (
    <div>
        <ChefHeader chef={chef}></ChefHeader>
        <ChefTabs chef={chef}></ChefTabs>
    </div>
    

  )
}

export default PickChef