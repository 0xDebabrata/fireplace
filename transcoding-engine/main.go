package main

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"
    "os"

	ffmpeg "github.com/u2takey/ffmpeg-go"
	"gopkg.in/vansante/go-ffprobe.v2"
)

var supportedVideoCodecs = [2]string{"h264", "hevc"}
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

    filepath1 := "/Users/debabrata/Downloads/deb go karting.mp4"
    //filepath2 := "/Users/debabrata/Downloads/Prisoners/Prisoners.mp4"
    filepath := filepath1

    filePathSlices := strings.Split(filepath, "/")
    videoNameWithExtension := filePathSlices[len(filePathSlices) - 1]
    videoNameSlices := strings.Split(videoNameWithExtension, ".")
    // Join all slices except the final element which contains the extension
    videoName := strings.Join(videoNameSlices[:len(videoNameSlices) - 1], ".")
    fmt.Println("Video name:", videoName)

    ctx, cancelFn := context.WithTimeout(context.Background(), 5 * time.Second)
    defer cancelFn()

    ffprobeOutput, err := ffprobe.ProbeURL(ctx, filepath)
    if err != nil {
        log.Panicf("Error probing video file: %v", err)
    }
    videoStreamData := ffprobeOutput.FirstVideoStream()
    audioStreamData := ffprobeOutput.FirstAudioStream()
    fmt.Println("Video codec:", videoStreamData.CodecName)
    fmt.Println("Audio codec:", audioStreamData.CodecName)

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

    fmt.Println("Video codec arg:", videoCodecArg)
    fmt.Println("Audio codec arg:", audioCodecArg)

    outputName := fmt.Sprintf("tmp/%s.m3u8", videoName)

    err = ffmpeg.Input(filepath).
                Output(outputName, ffmpeg.KwArgs{
                    "c:v": videoCodecArg,
                    "c:a": audioCodecArg,

                    "start_number": "0",
                    "hls_time": "10",
                    "hls_list_size": "0",
                    "f": "hls",
                }).
                OverWriteOutput().
                ErrorToStdOut().
                Run()
    if err != nil {
        log.Panicf("Error transcoding video file: %v", err)
    }
}
