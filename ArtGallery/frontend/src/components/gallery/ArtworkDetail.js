import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrderCreateForm from '@/components/orders/OrderCreateForm';

export default function ArtworkDetail({ artwork }) {
  const router = useRouter();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  if (!artwork) return null;
  
  const fullImageUrl = `http://localhost:8082${artwork.imageUrl}`;

  const handleOrderClick = () => {
    console.log("Authentication state:", { isAuthenticated, user }); // Log authentication state
    if (!isAuthenticated) {
      console.log("User is not authenticated. Redirecting to login...");
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    console.log("User is authenticated. Opening order modal...");
    setShowOrderModal(true);
  };

  const handleOrderSuccess = () => {
    setShowOrderModal(false);
    router.push('/dashboard/customer');
  };

  const canOrder = artwork.status === 'AVAILABLE' && (!user || user?.role?.toLowerCase() === 'customer');

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2">
              <div className="relative h-[400px] w-full">
                <Image
                  src={fullImageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  unoptimized={true}
                  loader={({ src }) => src}
                />
              </div>
            </div>
            
            {/* Details Section */}
            <div className="md:w-1/2 p-8">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">{artwork.title}</h1>
                <p className="text-gray-800">{artwork.description}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Price</h3>
                  <p className="text-gray-800 font-bold">${artwork.price.toFixed(2)}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Details</h3>
                  <ul className="space-y-2">
                    <li><span className="text-gray-800">Medium:</span> {artwork.medium}</li>
                    <li><span className="text-gray-800">Dimensions:</span> {artwork.dimensions}</li>
                    <li><span className="text-gray-800">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        artwork.status === 'SOLD' ? 'bg-red-100 text-red-800' :
                        artwork.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {artwork.status}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {artwork.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Order Button */}
                {canOrder && (
                  <div className="mt-6">
                    <Button
                      onClick={handleOrderClick}
                      className="w-full"
                      size="lg"
                    >
                      Purchase Artwork
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <Link
                  href="/gallery"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Purchase Artwork</DialogTitle>
          </DialogHeader>
          <OrderCreateForm 
            artwork={artwork} 
            onSuccess={handleOrderSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}