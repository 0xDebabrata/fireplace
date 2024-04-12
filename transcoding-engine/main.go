package main

import (
	"context"
	"bytes"
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
	"time"

	"gopkg.in/vansante/go-ffprobe.v2"
)

var supportedVideoCodecs = [2]string{"h264"}
var supportedAudioCodecs = [2]string{"aac"}

func createTempDir () {
    dir := "tmp"
    if _, err := os.Stat(dir); os.IsNotExist(err) {
        err := os.MkdirAll(dir, 0755)
        if err != nil {
            log.Panicf("Error creating tmp directory: %v", err)
        }
    }
}

func main() {
    createTempDir()

    filepath := "/Users/debabrata/Downloads/deb go karting.mp4"

    // Extract video name
    filePathSlices := strings.Split(filepath, "/")
    videoNameWithExtension := filePathSlices[len(filePathSlices) - 1]
    videoNameSlices := strings.Split(videoNameWithExtension, ".")
    // Join all slices except the final element which contains the extension
    videoName := strings.Join(videoNameSlices[:len(videoNameSlices) - 1], ".")
    fmt.Println("Video name:", videoName)

    ctx, cancelFn := context.WithTimeout(context.Background(), 5 * time.Second)
    defer cancelFn()

    // Read input video and audio codecs
    ffprobeOutput, err := ffprobe.ProbeURL(ctx, filepath)
    if err != nil {
        log.Panicf("Error probing video file: %v", err)
    }
    videoStreamData := ffprobeOutput.FirstVideoStream()
    audioStreamData := ffprobeOutput.FirstAudioStream()
    fmt.Println("Input video codec:", videoStreamData.CodecName)
    fmt.Println("Input audio codec:", audioStreamData.CodecName)

    // Set output video and audio codecs
    // Copy codec if file already has supported codecs. Prevents unnecessary
    // transcoding
    videoCodecArg := "libx264"
    for _, codec := range supportedVideoCodecs {
        if videoStreamData.CodecName == codec {
            videoCodecArg = "copy"
            break
        }
    }

    audioCodecArg := "aac"
    for _, codec := range supportedAudioCodecs {
        if audioStreamData.CodecName == codec {
            audioCodecArg = "copy"
            break
        }
    }

    fmt.Println("Output video codec:", videoCodecArg)
    fmt.Println("Output audio codec:", audioCodecArg)

    // outputName := fmt.Sprintf("tmp/%s.m3u8", videoName)
    cmd := exec.Command(
        "ffmpeg",
        "-i", filepath,
        "-filter_complex", "[0:v]split=3[v1][v2][v3]; [v1]copy[v1out]; [v2]scale=-2:720[v2out]; [v3]scale=-2:360[v3out]",

        "-map", "[v1out]",
        "-c:v:0", "libx264",
        "-b:v:0", "5M", "-maxrate:v:0", "5M", "-minrate:v:0", "5M", "-bufsize:v:0", "10M",
        "-g", "48", "-sc_threshold", "0", "-keyint_min", "48",

        "-map", "[v2out]",
        "-c:v:1", "libx264",
        "-b:v:1", "3M", "-maxrate:v:1", "3M", "-minrate:v:1", "3M", "-bufsize:v:1", "3M",
        "-g", "48", "-sc_threshold", "0", "-keyint_min", "48",
        "-map", "[v3out]",

        "-c:v:2", "libx264",
        "-b:v:2", "1M", "-maxrate:v:2", "1M", "-minrate:v:2", "1M", "-bufsize:v:2", "1M",
        "-g", "48", "-sc_threshold", "0", "-keyint_min", "48",

        "-map", "a:0", "-c:a:0", audioCodecArg,
        "-map", "a:0", "-c:a:1", audioCodecArg,
        "-map", "a:0", "-c:a:2", audioCodecArg,

        "-f", "hls",
        "-hls_time", "2", "-hls_playlist_type", "vod",
        "-hls_flags", "independent_segments", "-hls_segment_type", "mpegts",
        "-hls_segment_filename", "stream_%v/data%02d.ts",
        "-master_pl_name", "master.m3u8",
        "-var_stream_map", "v:0,a:0, v:1,a:1 v:2,a:2", "stream_%v/stream.m3u8",
    )

    var out bytes.Buffer
    var stderr bytes.Buffer
    cmd.Stdout = &out
    cmd.Stderr = &stderr

    err = cmd.Run()
    if err != nil {
        fmt.Println(fmt.Sprint(err))
        fmt.Println(stderr.String())
        fmt.Println(out.String())
        return
    }
    fmt.Println(stderr.String())

    if err != nil {
        log.Panicf("Error transcoding video file: %v", err)
    }
}

// FFMPEG HLS reference
// https://ottverse.com/hls-packaging-using-ffmpeg-live-vod/
