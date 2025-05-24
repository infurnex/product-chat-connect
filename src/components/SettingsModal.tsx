
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserPreferences, useUpdateUserPreferences } from "@/hooks/useUserPreferences";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { data: preferences } = useUserPreferences();
  const updatePreferences = useUpdateUserPreferences();
  const [gender, setGender] = useState('prefer-not-to-say');
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('English');
  const [age, setAge] = useState<number | null>(preferences?.age || undefined);
  const [name, setName] = useState(preferences?.name || '');
  const [budget, setBudget] = useState('');
  const [categories, setCategories] = useState('');
  const [brands, setBrands] = useState('');
  const [eco, setEco] = useState('no-preference');
  const [shipping, setShipping] = useState('no-preference');

  // Update local state when preferences load
  useEffect(() => {
    if (preferences) {
      setGender(preferences.gender || 'prefer-not-to-say');
      setCountry(preferences.country || '');
      setLanguage(preferences.language || 'English');
      setAge(preferences.age || null);
      setName(preferences.name || '');
      setBudget(preferences.budget || '');
      setCategories(preferences.categories || '');
      setBrands(preferences.brands || '');
      setEco(preferences.eco || 'no-preference');
      setShipping(preferences.shipping || 'no-preference');
    }
  }, [preferences]);

  const handleSave = () => {
    updatePreferences.mutate({
      gender: gender === 'prefer-not-to-say' ? undefined : gender,
      country: country || undefined,
      language,
      age: age ? age : null,
      name: name,
      budget: budget || undefined,
      categories: categories || undefined,
      brands: brands || undefined,
      eco: eco === 'no-preference' ? undefined : eco,
      shipping: shipping === 'no-preference' ? undefined : shipping,   
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              placeholder="Enter your age"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter your country"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Portuguese">Portuguese</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="Korean">Korean</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Russian">Russian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="budget">Budget Range (USD)</Label>
            <Input
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. under 100, 50-200, no limit"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="categories">Preferred Categories</Label>
            <Input
              id="categories"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="e.g. fashion, electronics, home decor"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="brands">Preferred Brands</Label>
            <Input
              id="brands"
              value={brands}
              onChange={(e) => setBrands(e.target.value)}
              placeholder="e.g. Nike, Apple, Zara"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="eco">Sustainability Preference</Label>
            <Select value={eco} onValueChange={setEco}>
              <SelectTrigger>
                <SelectValue placeholder="Choose preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-preference">No Preference</SelectItem>
                <SelectItem value="eco-friendly">Eco-friendly</SelectItem>
                <SelectItem value="vegan">Vegan only</SelectItem>
                <SelectItem value="cruelty-free">Cruelty-free</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="shipping">Preferred Delivery Speed</Label>
            <Select value={shipping} onValueChange={setShipping}>
              <SelectTrigger>
                <SelectValue placeholder="Select delivery preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast (same/next day)</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="no-preference">No Preference</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={updatePreferences.isPending}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
