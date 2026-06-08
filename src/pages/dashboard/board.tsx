import React, {useState, useMemo} from "react";
import {Card, Select, Row, Col, Typography, Space, Affix} from "antd"

const {Title, Text} = Typography;

export const BoardView: React.FC = () => {

    return (
        <div style={{padding: "24px", minHeight: "100vh"}}>
            <Affix offsetTop={64}>
                <Card size="small" style={{borderRadius: "8px", borderTop: "4px solid #9b2247", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"}}>
                    <Row gutter={16} align="middle">
                        <Col xs={24} md={6}>
                            <Title level={4} style={{margin: 0}}>Tablero de Seguimiento</Title>
                        </Col>
                        {/*SELECTOR DE AÑO*/}
                        <Col xs={24} md={6}>
                            <Select placeholder="Seleccionar año" style={{width: "100%"}}>
                                <Select.Option value="2023">2023</Select.Option>
                                <Select.Option value="2024">2024</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                </Card>
            </Affix>
            En esta seccion se mostrara el tablero de seguimiento de presupuesto.
        </div>
    );
};