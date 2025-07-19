import React, { ReactNode } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react'


function Modal({ children , }: { children: ReactNode }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{ borderRadius: 8, padding: 24, minWidth: 320 }}>
                {children}
            </div>
        </div>
    );
}

function Manage({ is_super, product, customer, inventory  }) {
    const [showModal, setShowModal] = useState(true);
    const [selected, setSelected] = useState<string | null>(null);
    return (
        <AppLayout >
            {(!product || !customer || !inventory) && showModal ? (
                <Modal>
                    <Alert className={" border-2 border-red-600 rounded-xl"}>
                        <AlertTitle>Let op!</AlertTitle>
                        <AlertDescription>
                            Je mist data in een van de 3 kolommen: producten, klanten of inventaris.
                            <div className={'flex-1'}>data rijen in product : {product}.</div>
                            <div className="flex-1">data rijen in customer : {customer}.</div>
                            <div className="flex-1">data rijen in inventory : {inventory}.</div>
                            <div className={"mt-2 space-x-5"}>
                            <Link href={route('admin.import')} className={'text-primary font-bold  rounded-xl underline'}>Importeer hier</Link>
                            <button onClick={() => setShowModal(false)} className={"text-red-600 underline font-bold"}>of ga door zonder data</button>
                            </div>
                        </AlertDescription>
                    </Alert>
                </Modal>
            ) : (
                <div className={'flex flex-col'}>
                    {is_super && <Link href={route('admin.addAdmin')} className={"bg-secondary  text-xl m-2 underline p-2 rounded hover:to-95% hover:from-white/20 bg-radial"}>Manage admins</Link>}
                    <button className={" backdrop-blur-2xl bg-radial text-xl m-2 underline p-2 rounded text-left hover:to-95% hover:from-white/20"}  onClick={() => {setSelected(selected === 'product1' ? null : 'product1')}}>products { selected == 'product1' && <div className={"bg-white "}>nice</div>}</button>
                    <button className={"bg-secondary bg-radial text-xl m-2 underline p-2 rounded text-left hover:to-95% hover:from-white/20"}  onClick={() => {setSelected(selected === 'product2' ? null : 'product2')}}>products { selected == 'product2' && <div className={"bg-white "}>nice</div>}</button>
                    <button className={"bg-secondary bg-radial text-xl m-2 underline p-2 rounded text-left hover:to-95% hover:from-white/20"}  onClick={() => {setSelected(selected === 'product3' ? null : 'product3')}}>products { selected == 'product3' && <div className={"bg-white "}>nice</div>}</button>
                </div>
            )}
        </AppLayout>
    );
}

export default Manage;
