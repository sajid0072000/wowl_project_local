import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {RestApiService} from "../../rest-api.service";
import{io} from 'socket.io-client';

declare var $: any;
// declare var io: any;

@Component({
    selector: 'app-ng-chunk-upload',
    templateUrl: './ng-chunk-upload.component.html',
    styleUrls: ['./ng-chunk-upload.component.css']
})
export class NgChunkUploadComponent implements OnInit {
    startTime = 0;
    socketGlobal: any = null;
    socketSetUp = false;
    baseUrl = '';
    isUploadCancel = false;
    @Output() onFileSelect:EventEmitter<any>= new EventEmitter();
    constructor(private rest: RestApiService) {
        this.baseUrl = this.rest.UPLOAD_URL;
    }

    ngOnInit(): void {

    }

    log(msg: any): void {
        console.log(msg);
    }

    bts(bytes: any) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024,
            decimals = 2;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    updateChunkProgress(fileId: any, progress: any) {
        progress = progress.toFixed(0);
        const progressBar: any = document.getElementById('progressBar');
        const progressElem: any = document.getElementById('progress');
        if (progress < 100) {
            progressBar.classList.add("progress-bar-animated");
            progressBar.style.width = progress + '%';
            progressBar.setAttribute('aria-valuenow', progress);
            progressElem.innerHTML = "Uploading " + progress + "%";
        } else if (progress == 100) {
            progressBar.style.width = progress + '%';
            progressBar.setAttribute('aria-valuenow', progress);
            progressElem.innerHTML = 'Please wait...';
        } else if (progress == 999) {
            progressBar.style.width = progress + '%';
            progressBar.setAttribute('aria-valuenow', progress);
            progressBar.classList.remove('progress-bar-animated');
            progressElem.innerHTML = 'File Upload Complete.';
            this.onFileSelect.emit({file: fileId + '/' + fileId + '_playlist.m3u8', complete: true});
        }
    }

    async setUpSocket(fileId: any) {
        try {
            const socket = io(this.rest.UPLOAD_SOCKET_URL, {path: "/usocket"});
            this.socketGlobal = await socket
            socket.on('connect',  () => {
                if (fileId != null) {

                    this.log("Joining room via socket");
                    socket.emit("fileRoom", fileId)
                }
            });
            socket.on('roomJoin', (data:any) => {
                console.log(JSON.stringify(data));

                const timerFunc = () => {
                    this.log("Checking file status in interval");
                    if (socket.connected) {
                        socket.emit("fileStatus", fileId)
                    } else {
                        this.log("Stopping file status interval");
                        stopTimerFunc()
                    }
                }
                const sockInterval = setInterval(timerFunc, 10000);
                const stopTimerFunc = () => {
                    clearInterval(sockInterval);
                }
            });
            socket.on("fileStatus", (data:any) => {
                console.log(JSON.stringify(data));
                const res = data.result;
                if (res != null) {
                    const resFileId = res.fileId;
                    if (resFileId == fileId) {
                        const uploaded = res.uploaded;
                        if (uploaded) {
                            this.updateChunkProgress(fileId, 999);
                            if (fileId != null) {
                                this.log("File uploaded");
                                const endtime = new Date().getTime();
                                const sec = Number((endtime - this.startTime) / 1000);
                                this.log("Time taken " + sec + " secs");
                                socket.emit("fileRoomLeave", fileId);
                                socket.disconnect();
                            }
                        }
                    }
                }
            });
            setTimeout(() => {
                if (this.socketGlobal != null) {
                    this.log("Start Merging Via Socket");
                    this.socketGlobal.emit("startMerging", { fileId: fileId });
                }
            }, 1000);
        } catch (err) {
            console.log(err);
        } finally {
            this.socketSetUp = true
        }
    }

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //Function for chunk upload
    async uploadChunksInBatches(fileId: any, file: any) {

        const chunkSize = 512 * 1024;
        const chunks = [];
        let chunkStatus: any = {};
        let chunkStatusIndex = 0;

        // Split the file into chunks
        for (let offset = 0; offset < file.size; offset += chunkSize) {
            const chunk = file.slice(offset, offset + chunkSize);
            chunkStatus[chunkStatusIndex++] = false;
            chunks.push(chunk);
        }

        const batchSize = 10;
        let batchIndex = 0;
        let completedChunks = 0;
        let totalChunks = chunks.length;
        while (batchIndex < totalChunks && !this.isUploadCancel) {
            const uploadPromises = [];
            let bathFailed = false;
            for (let i = batchIndex; i < batchIndex + batchSize && i < totalChunks; i++) {
                const chunk = chunks[i];
                const uploadPromise = async () => {
                    const formData = new FormData();
                    await formData.append('chunk', chunk);
                    const controller = new AbortController();
                    const timeoutId = setTimeout(async () => {
                        controller.abort()
                        bathFailed = true
                        await this.sleep(2000)
                    }, 60000);
                    try {
                        let startTime = new Date().getTime();
                        var headers = new Headers();
                        headers.append("X-Chunk-Index", i + '');
                        headers.append("X-File-Id", fileId);
                        const resp = await fetch(this.baseUrl + '/upload', {
                            method: 'POST',
                            body: formData,
                            headers: headers,
                            signal: controller.signal
                        });
                        const response = await resp.json();
                        if (response.success) {
                            let endTime = new Date().getTime();
                            let diff = ((endTime - startTime) / 1000).toFixed(1);
                            this.log("Chunk " + i + " uploaded successfully :: " + diff + " secs");
                            bathFailed = bathFailed ? true : false;
                            chunkStatus[i] = true
                        } else {
                            this.log("Chunk " + i + "upload failed. Retrying..");
                            bathFailed = true;
                            await this.sleep(2000)
                        }
                    } catch (err) {
                        console.log(err)
                        this.log("Chunk " + i + " upload failed. Retrying..")
                        bathFailed = true;
                        await this.sleep(2000);
                    } finally {
                        clearTimeout(timeoutId);
                    }
                };
                if (!chunkStatus[i]) {
                    await uploadPromises.push(uploadPromise());
                } else {
                    this.log("Skip " + i)
                }
            }
            this.log("Batch Start - Chunk Index " + batchIndex);
            if (uploadPromises.length > 0) {
                await Promise.all(uploadPromises);

                if (!bathFailed) {
                    batchIndex = batchIndex + batchSize;
                    completedChunks = completedChunks + batchSize;
                    if (completedChunks > totalChunks) {
                        completedChunks = totalChunks
                    }
                    this.log("Total Chunks : " + totalChunks + " Completed : " + completedChunks);
                    let progress = (completedChunks / totalChunks) * 100;
                    this.updateChunkProgress(fileId, progress);
                    if (completedChunks == totalChunks) {
                        this.setUpSocket(fileId);
                    }
                }
            } else {
                this.log("Batch Empty. Sleep 1 sec");
                await this.sleep(1000)
            }

        }
    }

    async getFileId(size: number, name: any) {
        let fileId = null;
        let chunkable = null;
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const raw = JSON.stringify({ fSize: size, fName: name });
            const resp = await fetch(this.baseUrl + '/fileId', {
                method: 'POST',
                headers: headers,
                body: raw
            });
            if (resp.ok) {
                const response = await resp.json();
                console.log('response >>>>>>>>> ', response);

                if (response.success) {
                    fileId = await response.fileId;
                    chunkable = await response.chunkable;
                    return { fileId, chunkable }
                } else {
                    return { fileId, chunkable }
                }
            } else {
                return { fileId, chunkable }
            }
        } catch (err) {
            console.log(err)
            return { fileId, chunkable }
        }

    }

    async uploadFile() {
        const inpFile: any = document.getElementById('fileBtn');
        if(inpFile && inpFile.files.length > 0) {
            const file = inpFile.files[0];
            let size = file.size;
            const fname = file.name;
            this.log(fname);
            this.log(this.bts(size));
            const { fileId, chunkable } = await this.getFileId(size, fname);
            console.log(chunkable);
            if (fileId) {
                // this.onFileSelect.emit({file: fileId + '/' + fileId + '_playlist.m3u8', complete: false});
                const progressBar: any = document.getElementById('progressBar');
                this.startTime = new Date().getTime();
                progressBar.classList.add("progress-bar-animated");
                this.log("File Id : " + fileId);
                this.updateChunkProgress(fileId, 0);
                this.uploadChunksInBatches(fileId, file)
            }
        }
    }




}
