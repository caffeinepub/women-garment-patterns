import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ImagePlus, RefreshCw, Ruler, Scissors, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import type { Measurements } from "../backend.d";
import { useCalculatePattern, useListGarments } from "../hooks/useQueries";
import { PatternDiagram } from "./PatternDiagram";

const DEFAULT_MEASUREMENTS: Measurements = {
  bust: 86,
  waist: 70,
  hip: 92,
  length: 100,
};

const FALLBACK_GARMENTS = [
  {
    name: "Salwar",
    description: "Traditional drawstring trousers with a tapered leg",
  },
  {
    name: "Kameez",
    description: "Long tunic shirt with side slits, worn over salwar",
  },
  {
    name: "Kurti",
    description: "Short decorative tunic, hip-length or knee-length",
  },
  { name: "Blouse", description: "Fitted blouse worn with saree or lehenga" },
];

const MEASUREMENT_FIELDS = [
  { field: "bust" as const, label: "Bust", hint: "Around fullest point" },
  { field: "waist" as const, label: "Waist", hint: "Natural waistline" },
  { field: "hip" as const, label: "Hip", hint: "Around widest point" },
  { field: "length" as const, label: "Length", hint: "Neckline to hem" },
];

function PhotoUpload() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.match(/image\/(jpeg|png)/)) return;
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      setPhotoUrl(URL.createObjectURL(file));
      setFileName(file.name);
    },
    [photoUrl],
  );

  function handleRemove() {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      <div>
        <Label className="text-sm font-semibold text-foreground">
          Reference Photo (JPG/PNG)
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5">
          Upload garment photo as cutting reference
        </p>
      </div>

      {photoUrl ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-xl overflow-hidden border border-border/60 bg-muted/20"
        >
          <img
            src={photoUrl}
            alt="Reference garment"
            className="w-full object-contain rounded-xl"
            style={{ maxHeight: 200 }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-3 py-2 flex items-center justify-between">
            <span className="text-white text-xs truncate max-w-[200px]">
              {fileName}
            </span>
            <button
              type="button"
              data-ocid="generator.photo.delete_button"
              onClick={handleRemove}
              className="text-white/80 hover:text-white transition-colors ml-2 flex-shrink-0"
              aria-label="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ) : (
        <div
          data-ocid="generator.photo.dropzone"
          aria-label="Photo upload dropzone"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <ImagePlus className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag & drop or{" "}
            <button
              type="button"
              data-ocid="generator.photo.upload_button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="text-primary font-medium hover:underline focus:outline-none"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG and PNG supported
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}

export function PatternGenerator() {
  const [selectedGarment, setSelectedGarment] = useState("");
  const [measurements, setMeasurements] =
    useState<Measurements>(DEFAULT_MEASUREMENTS);
  const [pendingMeasurements, setPendingMeasurements] =
    useState<Measurements>(DEFAULT_MEASUREMENTS);
  const [generateTrigger, setGenerateTrigger] = useState<Measurements | null>(
    null,
  );

  const { data: garments, isLoading: garmentsLoading } = useListGarments();
  const garmentList =
    garments && garments.length > 0 ? garments : FALLBACK_GARMENTS;

  const { data: patternData, isLoading: patternLoading } = useCalculatePattern(
    selectedGarment,
    generateTrigger,
  );

  function handleGenerate() {
    setMeasurements(pendingMeasurements);
    setGenerateTrigger({ ...pendingMeasurements });
  }

  function handleMeasurementChange(field: keyof Measurements, value: string) {
    const num = Number.parseFloat(value);
    if (!Number.isNaN(num) && num > 0) {
      setPendingMeasurements((prev) => ({ ...prev, [field]: num }));
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-card rounded-2xl border border-border/60 shadow-pattern overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-border/40 bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Ruler className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Body Measurements
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                All measurements in centimetres
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Photo upload section */}
          <PhotoUpload />

          <div className="space-y-2">
            <Label
              htmlFor="garment-select"
              className="text-sm font-semibold text-foreground"
            >
              Garment Type
            </Label>
            {garmentsLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={selectedGarment}
                onValueChange={setSelectedGarment}
              >
                <SelectTrigger
                  id="garment-select"
                  data-ocid="generator.select"
                  className="bg-background"
                >
                  <SelectValue placeholder="Select a garment type..." />
                </SelectTrigger>
                <SelectContent>
                  {garmentList.map((g) => (
                    <SelectItem key={g.name} value={g.name}>
                      <span className="font-medium">{g.name}</span>
                      {g.description && (
                        <span className="ml-2 text-muted-foreground text-xs">
                          {g.description}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MEASUREMENT_FIELDS.map(({ field, label, hint }) => (
              <div key={field} className="space-y-1.5">
                <Label
                  htmlFor={`input-${field}`}
                  className="text-sm font-semibold text-foreground"
                >
                  {label}{" "}
                  <span className="text-muted-foreground font-normal">
                    (cm)
                  </span>
                </Label>
                <Input
                  id={`input-${field}`}
                  data-ocid={`generator.${field}.input`}
                  type="number"
                  min="30"
                  max="200"
                  step="0.5"
                  defaultValue={DEFAULT_MEASUREMENTS[field]}
                  onChange={(e) =>
                    handleMeasurementChange(field, e.target.value)
                  }
                  className="bg-background text-center font-medium"
                />
                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              data-ocid="generator.primary_button"
              onClick={handleGenerate}
              disabled={!selectedGarment || patternLoading}
              className="px-8 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              size="lg"
            >
              {patternLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Scissors className="w-4 h-4" />
              )}
              {patternLoading ? "Calculating..." : "Generate Pattern"}
            </Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {patternLoading && (
          <motion.div
            data-ocid="generator.loading_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-border/60 overflow-hidden"
              >
                <div className="p-4 border-b border-border/40">
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="p-4">
                  <Skeleton className="h-52 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {!patternLoading && patternData && patternData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  {selectedGarment} Pattern
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {patternData.length} pattern piece
                  {patternData.length !== 1 ? "s" : ""} &bull; Bust{" "}
                  {measurements.bust}cm &middot; Waist {measurements.waist}cm
                  &middot; Hip {measurements.hip}cm &middot; Length{" "}
                  {measurements.length}cm
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-6 h-px border-t-2 border-foreground" />
                  Cut line
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-6 h-px border-t-2 border-primary border-dashed" />
                  Fold line
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-6 h-px border-t-2 border-accent" />
                  Grain line
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {patternData.map(([piece, pieceMeasurements], i) => (
                <motion.div
                  key={piece.name}
                  data-ocid={`pattern.item.${i + 1}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <PatternDiagram
                    piece={piece}
                    measurements={pieceMeasurements}
                    index={i}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!patternLoading && !generateTrigger && (
          <motion.div
            data-ocid="generator.empty_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 rounded-2xl border-2 border-dashed border-border/60"
          >
            <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
              <Scissors className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">
              Ready to Cut
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Select a garment type, enter your measurements, and click
              &ldquo;Generate Pattern&rdquo; to see your custom cutting layout.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
