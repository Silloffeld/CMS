import DataTable from '@/components/data-table';
import InventoryTable from '@/components/InventoryTable';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { ReactNode, useState } from 'react';

function Modal({ children }: { children: ReactNode }) {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <div style={{ borderRadius: 8, padding: 24, minWidth: 320 }}>{children}</div>
        </div>
    );
}

function Manage({ is_super, product, customer, inventory, productData, inventoryData }) {
    const [showModal, setShowModal] = useState(true);
    const [selected, setSelected] = useState<string | null>(null);
    return (
        <AppLayout>
            {(!product || !customer || !inventory) && showModal ? (
                <Modal>
                    <Alert className={'rounded-xl border-2 border-red-600'}>
                        <AlertTitle>Let op!</AlertTitle>
                        <AlertDescription>
                            Je mist data in een van de 3 kolommen: producten, klanten of inventaris.
                            <div className={'flex-1'}>data rijen in product : {product}.</div>
                            <div className="flex-1">data rijen in customer : {customer}.</div>
                            <div className="flex-1">data rijen in inventory : {inventory}.</div>
                            <div className={'mt-2 space-x-5'}>
                                <Link href={route('admin.import')} className={'rounded-xl font-bold text-primary underline'}>
                                    Importeer hier
                                </Link>
                                <button onClick={() => setShowModal(false)} className={'font-bold text-red-600 underline'}>
                                    of ga door zonder data
                                </button>
                            </div>
                        </AlertDescription>
                    </Alert>
                </Modal>
            ) : (
                <div className={'flex flex-col'}>
                    {is_super && (
                        <Link
                            href={route('admin.addAdmin')}
                            className={'m-2 rounded bg-secondary bg-radial p-2 text-xl underline hover:from-white/20 hover:to-95%'}
                        >
                            Manage admins
                        </Link>
                    )}
                    <div className={'m-2 rounded bg-secondary'}>
                        <button
                            className={
                                'mb-0 w-full rounded-t bg-secondary bg-radial p-2 text-left text-xl underline hover:from-white/20 hover:to-95%'
                            }
                            onClick={() => {
                                setSelected(selected === 'product1' ? null : 'product1');
                            }}
                        >
                            products
                        </button>
                        {selected == 'product1' && (
                            <div className={'m-2 mt-0'}>
                                <DataTable productData={productData} title={'product'} editLink={'admin.editProduct'} addLink={'admin.addProduct'} />
                            </div>
                        )}
                    </div>
                    <button
                        className={'m-2 rounded bg-secondary bg-radial p-2 text-left text-xl underline hover:from-white/20 hover:to-95%'}
                        onClick={() => {
                            setSelected(selected === 'product2' ? null : 'product2');
                        }}
                    >
                        inventory{' '}
                        {selected == 'product2' && (
                            <div className={'m-2'}>
                                <InventoryTable inventoryData={inventoryData} editLink={'admin.editProduct'} addLink={'admin.addProduct'} />
                            </div>
                        )}
                    </button>
                </div>
            )}
        </AppLayout>
    );
}

export default Manage;
