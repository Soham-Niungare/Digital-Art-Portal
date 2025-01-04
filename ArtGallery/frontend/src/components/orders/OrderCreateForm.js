import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createOrder } from '@/store/slices/orderSlice';
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function OrderCreateForm({ artwork, onSuccess }) {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    artworkId: artwork.id,
    shippingAddress: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await dispatch(createOrder(formData)).unwrap();
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
      <h3 className="font-medium text-gray-800">Artwork Details</h3>
      <p className="inline text-blue-600">{artwork.title}</p> {/* Inline for title */}
      <h3 className="text-sm text-muted-foreground text-green-600">
        Price: ${artwork.price}
      </h3> {/* Inline for price */}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-800">Shipping Address</label>
        <Textarea
          required
          value={formData.shippingAddress}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            shippingAddress: e.target.value
          }))}
          placeholder="Enter your shipping address"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? "Processing..." : "Confirm Purchase"}
      </Button>
    </form>
  );
}
