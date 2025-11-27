# Geofence Polygon Debug Guide

## Problem Summary

The geofence was showing `Inside now: false, Was inside: false`, meaning the user's location is **outside the office polygon**, so no clock-in/out mutations are triggered.

**User Location:** `5.620818, -0.185401`

---

## Original Polygon (NOT WORKING)

```typescript
coordinates: [
  { latitude: 5.620765, longitude: -0.185407 }, // Point 1
  { latitude: 5.620765, longitude: -0.185123 }, // Point 2
  { latitude: 5.621334, longitude: -0.185611 }, // Point 3
  { latitude: 5.621445, longitude: -0.185296 }, // Point 4
];
```

**Issue:** The polygon was too small and didn't properly enclose the user's location.

---

## Updated Polygon (EXPANDED)

```typescript
coordinates: [
  { latitude: 5.6207, longitude: -0.1855 }, // Top-left
  { latitude: 5.6207, longitude: -0.185 }, // Top-right
  { latitude: 5.62145, longitude: -0.185 }, // Middle-right
  { latitude: 5.6215, longitude: -0.1857 }, // Bottom-right
  { latitude: 5.6213, longitude: -0.1857 }, // Bottom-left
  { latitude: 5.621, longitude: -0.1855 }, // Left side
];
```

**Bounds:**

- Latitude: `5.620700` to `5.621500`
- Longitude: `-0.185700` to `-0.185000`

**User Location Check:**

- Latitude: `5.620818` ✅ (within `5.620700` to `5.621500`)
- Longitude: `-0.185401` ✅ (within `-0.185700` to `-0.185000`)

**Expected Result:** `isInside = true`

---

## Debug Logging

When the background task runs, you'll see logs like:

```
🔍 [PolygonDebug] Testing point-in-polygon:
   Point: lat=5.620818, lon=-0.185401
   Polygon points: 6
     [0] lat=5.620700, lon=-0.185500
     [1] lat=5.620700, lon=-0.185000
     [2] lat=5.621450, lon=-0.185000
     [3] lat=5.621500, lon=-0.185700
     [4] lat=5.621300, lon=-0.185700
     [5] lat=5.621000, lon=-0.185500
   Result: isInside=true
   Bounds: lat [5.620700, 5.621500], lon [-0.185700, -0.185000]
   Point in bounds: lat=true, lon=true
```

---

## How to Adjust Polygon

If mutations still aren't triggering:

1. **Enable location sharing** on your device and physically move within the office area
2. **Check the logs** for the actual coordinates your device is reporting
3. **Expand the polygon** to include those coordinates

Example: If you see `Inside now: false` with location `5.620900, -0.185300`, adjust the polygon:

```typescript
coordinates: [
  { latitude: 5.6206, longitude: -0.1856 }, // Make wider/taller
  { latitude: 5.6206, longitude: -0.1849 },
  { latitude: 5.6216, longitude: -0.1849 },
  { latitude: 5.6216, longitude: -0.1858 },
  { latitude: 5.6211, longitude: -0.1858 },
  { latitude: 5.6206, longitude: -0.1856 },
];
```

---

## Testing the Polygon

When you reload the app:

1. ✅ Check console logs for the expanded polygon coordinates
2. ✅ Verify `isInside=true` appears in logs
3. ✅ When inside polygon: `Inside now: true`
4. ✅ When exiting polygon: `Inside now: false, Was inside: true` → ENTER EVENT
5. ✅ Mutation should trigger and refresh attendance data

---

## Expected Behavior After Fix

**Day 1: Enter Office**

```
[Geofence] Location: 5.620818, -0.185401
[Geofence] Inside now: true, Was inside: false
[Geofence] ENTER DETECTED! Was outside, now inside
[Geofence] SENDING ENTER MUTATION...
[ClockIn] SUCCESS - Clocked in user ID: 12345
[Dashboard] Clock-in successful - Refreshing attendance query
```

**Day 1: Leave Office**

```
[Geofence] Location: 5.619500, -0.184000  (outside polygon)
[Geofence] Inside now: false, Was inside: true
[Geofence] EXIT DETECTED! Was inside, now outside
[Geofence] SENDING EXIT MUTATION...
[ClockOut] SUCCESS - Clocked out user ID: 12345
[Dashboard] Clock-out successful - Refreshing attendance query
```

---

## Files Modified

1. **`components/GeolibFenceRegion.tsx`**

   - Updated `OfficeRegion` with expanded polygon coordinates
   - Changed from 4 points to 6 points for better coverage

2. **`components/GeolibFence.tsx`**
   - Added `debugPolygon()` utility function
   - Enhanced logging with polygon bounds checking
   - Now calls `debugPolygon()` instead of direct `GeoLib.isPointInPolygon()`

---

## Next Steps

1. ✅ Rebuild the app with new polygon
2. ✅ Watch console for debug logs
3. ✅ Move to different locations to test enter/exit
4. ✅ Check database for clock-in/clock-out records
5. ⚠️ If still not working, share the actual coordinates you're testing with and I'll adjust further

---

## Important Notes

- **Polygon must be closed:** Last point should connect back to first point (Geolib handles this)
- **Coordinates order matters:** Use clockwise or counter-clockwise consistently
- **More points = better coverage:** 6 points creates a hexagon which is better than 4 points (square)
- **Test with actual location:** Your test device must be within the polygon bounds
