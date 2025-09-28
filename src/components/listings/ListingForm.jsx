"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { LoadScript, GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";

const MAX_MEDIA_ITEMS = 10;
const furnitureOptions = [
  "Máy lạnh",
  "Máy giặt",
  "Tủ lạnh",
  "Tủ quần áo",
  "Giường",
  "Bếp",
  "Truyền hình cáp",
  "Wi-Fi",
];

const propertyTypes = [
  "Căn hộ",
  "Nhà phố",
  "Biệt thự",
  "Đất nền",
  "Phòng trọ",
  "Văn phòng",
];

const numberFromInput = (value) => {
  if (typeof value === "number") return value;
  if (!value) return undefined;
  const cleaned = `${value}`.replace(/[^\d.-]/g, "");
  if (!cleaned) return undefined;
  return Number(cleaned);
};

const listingSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  propertyType: z.string().min(1, "Vui lòng chọn loại bất động sản"),
  description: z
    .string()
    .min(20, "Mô tả cần chi tiết hơn (tối thiểu 20 ký tự)")
    .max(1800, "Mô tả không vượt quá 1800 ký tự"),
  address: z.string().min(5, "Địa chỉ không hợp lệ"),
  latitude: z
    .preprocess(numberFromInput, z.number().refine((val) => Math.abs(val) <= 90, "Vĩ độ không hợp lệ")),
  longitude: z
    .preprocess(numberFromInput, z.number().refine((val) => Math.abs(val) <= 180, "Kinh độ không hợp lệ")),
  area: z.preprocess(numberFromInput, z.number().positive("Diện tích phải lớn hơn 0")),
  bedrooms: z
    .preprocess(numberFromInput, z.number().int().positive("Số phòng ngủ phải lớn hơn 0")),
  bathrooms: z
    .preprocess(numberFromInput, z.number().int().positive("Số phòng tắm phải lớn hơn 0")),
  furniture: z.array(z.string()).default([]),
  price: z.preprocess(numberFromInput, z.number().positive("Giá phải lớn hơn 0")),
  deposit: z
    .preprocess((value) => {
      if (value === "" || value === null || typeof value === "undefined") return undefined;
      return numberFromInput(value);
    }, z.number().nonnegative("Tiền cọc không hợp lệ").optional()),
  media: z.object({
    images: z.array(z.string()).min(1, "Cần tối thiểu một hình ảnh"),
    videos: z.array(z.string()).max(MAX_MEDIA_ITEMS, "Tối đa 10 nội dung media"),
  }),
});

const steps = [
  { title: "Loại & mô tả", fields: ["propertyType", "title", "description"] },
  { title: "Hình ảnh & video", fields: ["media.images"] },
  { title: "Địa chỉ", fields: ["address", "latitude", "longitude"] },
  { title: "Diện tích & phòng", fields: ["area", "bedrooms", "bathrooms", "furniture"] },
  { title: "Giá & đặt cọc", fields: ["price", "deposit"] },
];

const libraries = ["places"];

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") return "";
  const asNumber = typeof value === "number" ? value : numberFromInput(value);
  if (!asNumber) return "";
  return asNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function ListingForm({ listing, landlordId, onSuccess }) {
  const router = useRouter();
  const defaultMedia = listing?.media && typeof listing.media === "object" ? listing.media : { images: [], videos: [] };
  const defaultFurniture = Array.isArray(listing?.furniture)
    ? listing.furniture
    : typeof listing?.furniture === "string"
    ? []
    : listing?.furniture || [];

  const {
    handleSubmit,
    register,
    control,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: listing?.title || "",
      propertyType: listing?.propertyType || "",
      description: listing?.description || "",
      address: listing?.address || "",
      latitude: listing?.latitude ?? 21.028511,
      longitude: listing?.longitude ?? 105.804817,
      area: listing?.area || "",
      bedrooms: listing?.bedrooms || "",
      bathrooms: listing?.bathrooms || "",
      furniture: defaultFurniture,
      price: listing?.price || "",
      deposit: listing?.deposit ?? "",
      media: {
        images: defaultMedia.images || [],
        videos: defaultMedia.videos || [],
      },
    },
  });

  const [activeStep, setActiveStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

  const media = watch("media");
  const furniture = watch("furniture") || [];
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const mapCenter = useMemo(() => ({
    lat: typeof latitude === "number" ? latitude : Number(latitude) || 21.028511,
    lng: typeof longitude === "number" ? longitude : Number(longitude) || 105.804817,
  }), [latitude, longitude]);

  const handleMediaUpload = async (event, type) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const totalItems = media.images.length + media.videos.length + files.length;
    if (totalItems > MAX_MEDIA_ITEMS) {
      toast.error(`Chỉ được tải tối đa ${MAX_MEDIA_ITEMS} nội dung (ảnh + video).`);
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrls = [];
      for (const file of files) {
        const key = `listings/${landlordId || "anonymous"}/${Date.now()}-${file.name}`;
        const storageRef = ref(storage, key);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(url);
      }

      const updated = {
        ...media,
        [type]: [...media[type], ...uploadedUrls],
      };
      setValue("media", updated, { shouldValidate: true });
      toast.success("Tải lên thành công");
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải tệp lên Firebase. Vui lòng thử lại");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveMedia = async (type, url) => {
    try {
      setIsUploading(true);
      const fileRef = ref(storage, url);
      await deleteObject(fileRef).catch(() => undefined);
      const updated = {
        ...media,
        [type]: media[type].filter((item) => item !== url),
      };
      setValue("media", updated, { shouldValidate: true });
      toast.success("Đã xóa nội dung");
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa tệp. Vui lòng thử lại");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFurnitureToggle = (item) => {
    const exists = furniture.includes(item);
    const updated = exists ? furniture.filter((value) => value !== item) : [...furniture, item];
    setValue("furniture", updated, { shouldValidate: true });
  };

  const goToNextStep = async () => {
    const stepFields = steps[activeStep].fields;
    const isValid = await trigger(stepFields);
    if (!isValid) {
      toast.error("Vui lòng hoàn thành thông tin trước khi tiếp tục");
      return;
    }
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToStep = async (index) => {
    if (index === activeStep) return;
    if (index > activeStep) {
      await goToNextStep();
    } else {
      setActiveStep(index);
    }
  };

  const onSubmit = async (values) => {
    if (activeStep < steps.length - 1) {
      await goToNextStep();
      return;
    }

    const payload = {
      ...values,
      furniture: values.furniture || [],
      media: {
        images: values.media.images || [],
        videos: values.media.videos || [],
      },
    };

    try {
      const response = await fetch(listing ? `/api/listings/${listing.id}` : "/api/listings", {
        method: listing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Không thể lưu tin đăng");
      }

      const data = await response.json();
      toast.success(listing ? "Đã cập nhật tin đăng" : "Tin đăng đã được tạo");
      if (onSuccess) {
        onSuccess(data);
      } else {
        router.push("/dashboard/landlord");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handlePlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    const location = place.geometry?.location;
    if (!location) return;
    const nextCenter = { lat: location.lat(), lng: location.lng() };
    setValue("address", place.formatted_address || place.name || "", { shouldValidate: true });
    setValue("latitude", nextCenter.lat, { shouldValidate: true });
    setValue("longitude", nextCenter.lng, { shouldValidate: true });
  };

  return (
    <form className="card" onSubmit={handleSubmit(onSubmit)}>
      <div className="step-indicator">
        {steps.map((step, index) => (
          <button
            key={step.title}
            type="button"
            onClick={() => goToStep(index)}
            className={index === activeStep ? "active" : ""}
          >
            <span className="step-indicator__dot">{index + 1}</span>
            <span>{step.title}</span>
          </button>
        ))}
      </div>

      {activeStep === 0 && (
        <section className="grid" style={{ gap: "1.5rem" }}>
          <div className="field">
            <label className="label" htmlFor="propertyType">
              Loại bất động sản
            </label>
            <select id="propertyType" className="input" {...register("propertyType")}>
              <option value="">Chọn loại bất động sản</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.propertyType && <span className="error-text">{errors.propertyType.message}</span>}
          </div>

          <div className="field">
            <label className="label" htmlFor="title">
              Tiêu đề tin đăng
            </label>
            <input id="title" className="input" placeholder="Ví dụ: Căn hộ 2PN nội thất cao cấp" {...register("title")} />
            {errors.title && <span className="error-text">{errors.title.message}</span>}
          </div>

          <div className="field">
            <label className="label" htmlFor="description">
              Mô tả chi tiết
            </label>
            <textarea
              id="description"
              className="input"
              rows={6}
              placeholder="Nêu rõ tiện ích, nội thất, môi trường xung quanh..."
              {...register("description")}
            />
            {errors.description && <span className="error-text">{errors.description.message}</span>}
          </div>
        </section>
      )}

      {activeStep === 1 && (
        <section className="grid" style={{ gap: "1.5rem" }}>
          <div className="field">
            <label className="label">Hình ảnh bất động sản</label>
            <input type="file" accept="image/*" multiple onChange={(event) => handleMediaUpload(event, "images")} />
            <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
              Cho phép tối đa {MAX_MEDIA_ITEMS} ảnh và video. Ảnh đầu tiên sẽ được dùng làm ảnh đại diện.
            </p>
            {errors.media?.images && <span className="error-text">{errors.media.images.message}</span>}
            <div className="media-preview">
              {media.images.map((url) => (
                <div key={url} className="media-preview__item">
                  <button type="button" className="media-preview__remove" onClick={() => handleRemoveMedia("images", url)}>
                    ×
                  </button>
                  <img src={url} alt="Ảnh bất động sản" />
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="label">Video giới thiệu (tùy chọn)</label>
            <input type="file" accept="video/*" multiple onChange={(event) => handleMediaUpload(event, "videos")} />
            <div className="media-preview">
              {media.videos.map((url) => (
                <div key={url} className="media-preview__item">
                  <button type="button" className="media-preview__remove" onClick={() => handleRemoveMedia("videos", url)}>
                    ×
                  </button>
                  <video src={url} controls />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeStep === 2 && (
        <section className="grid" style={{ gap: "1.5rem" }}>
          <div className="field">
            <label className="label">Địa chỉ</label>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} libraries={libraries}>
              <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceChanged}>
                <input
                  className="input"
                  placeholder="Nhập địa chỉ cụ thể"
                  {...register("address")}
                  defaultValue={watch("address")}
                />
              </Autocomplete>
              {errors.address && <span className="error-text">{errors.address.message}</span>}
              <div className="map-container" style={{ marginTop: "1rem" }}>
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  zoom={16}
                  center={mapCenter}
                  onClick={(event) => {
                    const lat = event.latLng?.lat();
                    const lng = event.latLng?.lng();
                    if (typeof lat !== "number" || typeof lng !== "number") return;
                    setValue("latitude", lat, { shouldValidate: true });
                    setValue("longitude", lng, { shouldValidate: true });
                  }}
                >
                  <Marker
                    position={mapCenter}
                    draggable
                    onDragEnd={(event) => {
                      const lat = event.latLng?.lat();
                      const lng = event.latLng?.lng();
                      if (typeof lat !== "number" || typeof lng !== "number") return;
                      setValue("latitude", lat, { shouldValidate: true });
                      setValue("longitude", lng, { shouldValidate: true });
                    }}
                  />
                </GoogleMap>
              </div>
            </LoadScript>
          </div>
        </section>
      )}

      {activeStep === 3 && (
        <section className="grid" style={{ gap: "1.5rem" }}>
          <div className="grid two">
            <div className="field">
              <label className="label" htmlFor="area">
                Diện tích sử dụng (m²)
              </label>
              <input id="area" className="input" type="number" step="0.1" min="0" {...register("area")} />
              {errors.area && <span className="error-text">{errors.area.message}</span>}
            </div>
            <div className="field">
              <label className="label" htmlFor="bedrooms">
                Phòng ngủ
              </label>
              <input id="bedrooms" className="input" type="number" min="0" {...register("bedrooms")} />
              {errors.bedrooms && <span className="error-text">{errors.bedrooms.message}</span>}
            </div>
            <div className="field">
              <label className="label" htmlFor="bathrooms">
                Phòng tắm
              </label>
              <input id="bathrooms" className="input" type="number" min="0" {...register("bathrooms")} />
              {errors.bathrooms && <span className="error-text">{errors.bathrooms.message}</span>}
            </div>
          </div>

          <div className="field">
            <label className="label">Tiện nghi</label>
            <div className="tag-list">
              {furnitureOptions.map((item) => {
                const checked = furniture.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleFurnitureToggle(item)}
                    className="tag"
                    style={{
                      background: checked ? "rgba(10, 124, 255, 0.12)" : undefined,
                      color: checked ? "var(--primary-dark)" : undefined,
                      border: checked ? "1px solid var(--primary)" : "1px solid transparent",
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            {errors.furniture && <span className="error-text">{errors.furniture.message}</span>}
          </div>
        </section>
      )}

      {activeStep === 4 && (
        <section className="grid two">
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <div className="field">
                <label className="label" htmlFor="price">
                  Giá thuê hàng tháng (VND)
                </label>
                <input
                  id="price"
                  className="input"
                  inputMode="numeric"
                  value={formatCurrency(field.value)}
                  onChange={(event) => {
                    const raw = event.target.value.replace(/[^\d]/g, "");
                    field.onChange(raw ? Number(raw) : "");
                  }}
                  placeholder="Ví dụ: 15000000"
                />
                {errors.price && <span className="error-text">{errors.price.message}</span>}
              </div>
            )}
          />

          <Controller
            name="deposit"
            control={control}
            render={({ field }) => (
              <div className="field">
                <label className="label" htmlFor="deposit">
                  Tiền đặt cọc (VND)
                </label>
                <input
                  id="deposit"
                  className="input"
                  inputMode="numeric"
                  value={formatCurrency(field.value)}
                  onChange={(event) => {
                    const raw = event.target.value.replace(/[^\d]/g, "");
                    field.onChange(raw ? Number(raw) : "");
                  }}
                  placeholder="Ví dụ: 30000000"
                />
                {errors.deposit && <span className="error-text">{errors.deposit.message}</span>}
              </div>
            )}
          />
        </section>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
        <button
          type="button"
          className="button secondary"
          onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
          disabled={activeStep === 0 || isSubmitting || isUploading}
        >
          Quay lại
        </button>
        <button type="submit" className="button" disabled={isSubmitting || isUploading}>
          {isSubmitting || isUploading
            ? "Đang xử lý..."
            : activeStep === steps.length - 1
            ? listing
              ? "Cập nhật tin"
              : "Đăng tin"
            : "Tiếp tục"}
        </button>
      </div>
    </form>
  );
}
